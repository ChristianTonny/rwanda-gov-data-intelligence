"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";

const API_BASE = ("http://192.168.1.66:5000").replace(/\/$/, "");

type IngestResult = { success: boolean; count?: number; sample?: any[]; error?: string };

export default function BackendDashboardPage() {
  const [health, setHealth] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Ingest
  const [file, setFile] = useState<File | null>(null);
  const [ingestResult, setIngestResult] = useState<IngestResult | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);

  // Search
  const [q, setQ] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHits, setSearchHits] = useState<any[]>([]);

  // Query (LLM)
  const [question, setQuestion] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [provenance, setProvenance] = useState<string[] | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);
  const [cost, setCost] = useState<number | null>(null);

  // Dashboard summary
  const [summary, setSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Tasks
  const [reindexLoading, setReindexLoading] = useState(false);
  const [reindexResult, setReindexResult] = useState<any | null>(null);

  async function fetchHealth() {
    try {
      setHealthLoading(true);
      const { data } = await axios.get(`http://192.168.1.66:5000/api/health`);
      setHealth(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setHealth(`Error: ${err?.message || String(err)}`);
    } finally {
      setHealthLoading(false);
    }
  }

  async function handleIngest(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!file) return setIngestResult({ success: false, error: "Pick a file first" });
    try {
      setIngestLoading(true);
      setIngestResult(null);
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post(`${API_BASE}/api/ingest`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIngestResult(data);
    } catch (err: any) {
      setIngestResult({ success: false, error: err?.message || String(err) });
    } finally {
      setIngestLoading(false);
    }
  }

  async function handleSearch(e?: React.FormEvent) {
    if (e) e?.preventDefault();
    try {
      setSearchLoading(true);
      setSearchHits([]);
      const { data } = await axios.get(`${API_BASE}/api/search`, { params: { q } });
      setSearchHits(data.hits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleQuery(e?: React.FormEvent) {
    if (e) e?.preventDefault();
    if (!question) return;
    try {
      setQueryLoading(true);
      setAnswer(null);
      setProvenance(null);
      setTokens(null);
      setCost(null);
      const { data } = await axios.post(`${API_BASE}/api/query`, { question });
      setAnswer(data.answer ?? null);
      setProvenance(data.provenance ?? null);
      setTokens(data.tokens ?? null);
      setCost(data.cost ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setQueryLoading(false);
    }
  }

  async function fetchSummary() {
    try {
      setSummaryLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/dashboards/summary`);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  }

  async function reindex() {
    try {
      setReindexLoading(true);
      setReindexResult(null);
      const { data } = await axios.post(`${API_BASE}/api/tasks/reindex`);
      setReindexResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setReindexLoading(false);
    }
  }



  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Backend dashboard (Node LLM Search)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">Check backend health endpoint</p>
            <div className="flex gap-2">
              <Button onClick={fetchHealth} disabled={healthLoading}>{healthLoading ? "..." : "Fetch"}</Button>
              <Button variant="ghost" onClick={() => setHealth(null)}>Clear</Button>
            </div>
            <pre className="mt-3 p-3 bg-surface-muted rounded text-sm overflow-auto max-h-48">{health ?? "No data"}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Index summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Quick dashboard stats from /api/dashboards/summary</p>
            <div className="flex gap-2 mt-3">
              <Button onClick={fetchSummary} disabled={summaryLoading}>{summaryLoading ? "..." : "Load"}</Button>
              <Button variant="ghost" onClick={() => setSummary(null)}>Clear</Button>
            </div>
            <pre className="mt-3 p-3 bg-surface-muted rounded text-sm">{summary ? JSON.stringify(summary, null, 2) : "No summary"}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Re-index CSVs in uploads</p>
            <div className="flex gap-2">
              <Button onClick={reindex} disabled={reindexLoading}>{reindexLoading ? "Reindexing..." : "Reindex"}</Button>
              <Button variant="ghost" onClick={() => setReindexResult(null)}>Clear</Button>
            </div>
            <pre className="mt-3 p-3 bg-surface-muted rounded text-sm">{reindexResult ? JSON.stringify(reindexResult, null, 2) : "No result"}</pre>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingest (Excel / CSV / JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIngest} className="space-y-3">
              <div>
                <Label>File</Label>
                <input type="file" accept=".csv,.json,.xls,.xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={ingestLoading}>{ingestLoading ? "Uploading..." : "Upload & Ingest"}</Button>
                <Button variant="ghost" onClick={() => { setFile(null); setIngestResult(null); }}>
                  Reset
                </Button>
              </div>

              <div>
                <pre className="mt-2 p-3 bg-surface-muted rounded text-sm max-h-64 overflow-auto">{ingestResult ? JSON.stringify(ingestResult, null, 2) : "No result"}</pre>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <Label>Query</Label>
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search keyword or phrase" />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={searchLoading}>{searchLoading ? "Searching..." : "Search"}</Button>
                <Button variant="ghost" onClick={() => { setQ(""); setSearchHits([]); }}>Clear</Button>
              </div>

              <div className="mt-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name / Raw</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchHits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>No hits</TableCell>
                      </TableRow>
                    )}
                    {searchHits.map((h, idx) => (
                      <TableRow key={h.id ?? idx}>
                        <TableCell className="w-24">{h.id}</TableCell>
                        <TableCell>
                          <pre className="text-xs max-h-32 overflow-auto">{JSON.stringify(h.doc, null, 2)}</pre>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Ask (LLM)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuery} className="space-y-3">
            <div>
              <Label>Question</Label>
              <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask something (will include top search docs as provenance)" />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={queryLoading}>{queryLoading ? "Thinking..." : "Ask"}</Button>
              <Button variant="ghost" onClick={() => { setQuestion(""); setAnswer(null); setProvenance(null); setTokens(null); setCost(null); }}>Clear</Button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <h4 className="text-sm font-medium">Answer</h4>
                <pre className="mt-2 p-3 bg-surface-muted rounded text-sm max-h-48 overflow-auto">{answer ?? "No answer yet"}</pre>
              </div>

              <div>
                <h4 className="text-sm font-medium">Provenance</h4>
                <pre className="mt-2 p-3 bg-surface-muted rounded text-sm max-h-48 overflow-auto">{provenance ? JSON.stringify(provenance, null, 2) : "None"}</pre>
              </div>

              <div>
                <h4 className="text-sm font-medium">Usage</h4>
                <div className="mt-2">
                  <div>Tokens: {tokens ?? "-"}</div>
                  <div>Cost: {cost ?? "-"}</div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="py-6 text-sm text-muted-foreground">API base: <code>{API_BASE}</code></div>
    </div>
  );
}
