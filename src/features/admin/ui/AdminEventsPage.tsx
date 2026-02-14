"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { useMutation, useQuery } from "@tanstack/react-query"
import { RefreshCcw, Play, Filter, X } from "lucide-react"
import { AdminLayout } from "./AdminLayout"
import { eventsApi, type EventRecord } from "@/shared/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

const PAGE_LIMIT = 15

function truncatePayload(payload: Record<string, unknown>) {
  const text = JSON.stringify(payload)
  if (text.length <= 160) return text
  return `${text.slice(0, 160)}...`
}

export function AdminEventsPage() {
  const t = useTranslations("admin")
  const [page, setPage] = useState(1)
  const [type, setType] = useState<string>("all")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [topic, setTopic] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-events", page, type, from, to],
    queryFn: () =>
      eventsApi.getEvents({
        page,
        limit: PAGE_LIMIT,
        type: type === "all" ? undefined : type,
        from: from || undefined,
        to: to || undefined,
      }),
  })

  const events = data?.data ?? []
  const meta = data?.meta

  const typeOptions = useMemo(() => {
    const base = new Set(events.map((event) => event.event_type))
    return Array.from(base)
  }, [events])

  const replayMutation = useMutation({
    mutationFn: (payload: { eventIds: string[]; topic?: string }) =>
      eventsApi.replayEvents(payload.eventIds, payload.topic),
    onSuccess: () => toast.success(t("replaySuccess")),
    onError: () => toast.error(t("error")),
  })

  const toggleSelect = (eventId: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(eventId)) {
        next.delete(eventId)
      } else {
        next.add(eventId)
      }
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) => {
      if (prev.size === events.length) {
        return new Set()
      }
      return new Set(events.map((event) => event.event_id))
    })
  }

  const handleReplay = (ids: string[]) => {
    if (ids.length === 0) {
      toast.message(t("replayEmpty"))
      return
    }
    replayMutation.mutate({ eventIds: ids, topic: topic || undefined })
  }

  const clearFilters = () => {
    setType("all")
    setFrom("")
    setTo("")
    setPage(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("eventsTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("eventsSubtitle")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("refresh")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t("filters")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("eventType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filterAll")}</SelectItem>
                  {typeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-56"
              />
              <Input
                type="datetime-local"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-56"
              />
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
                {t("clearFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>{t("eventsList")}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t("topicOptional")}
                className="w-48"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReplay(Array.from(selected))}
                disabled={replayMutation.isPending}
              >
                <Play className="h-4 w-4" />
                {t("replaySelected")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={events.length > 0 && selected.size === events.length}
                        onCheckedChange={toggleAll}
                        aria-label={t("selectAll")}
                      />
                    </TableHead>
                    <TableHead>{t("eventId")}</TableHead>
                    <TableHead>{t("eventType")}</TableHead>
                    <TableHead>{t("timestamp")}</TableHead>
                    <TableHead>{t("sourceService")}</TableHead>
                    <TableHead>{t("version")}</TableHead>
                    <TableHead>{t("payload")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        {t("loading")}
                      </TableCell>
                    </TableRow>
                  ) : events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        {t("noEvents")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event: EventRecord) => (
                      <TableRow key={event.event_id}>
                        <TableCell>
                          <Checkbox
                            checked={selected.has(event.event_id)}
                            onCheckedChange={() => toggleSelect(event.event_id)}
                            aria-label={t("select")}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{event.event_id}</TableCell>
                        <TableCell>{event.event_type}</TableCell>
                        <TableCell>{new Date(event.timestamp).toLocaleString("ru-RU")}</TableCell>
                        <TableCell>{event.source_service}</TableCell>
                        <TableCell>{event.version}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {truncatePayload(event.payload)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReplay([event.event_id])}
                          >
                            {t("replay")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t("page")} {meta?.page ?? page} / {meta?.total ? Math.ceil(meta.total / PAGE_LIMIT) : "—"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              {t("prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={meta?.hasMore === false}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
