import React, { useState } from "react";
import { entities } from "@/api/entities";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  CheckCircle, XCircle, Clock, CalendarDays, Search,
  Phone, Mail, StickyNote, ChevronDown, Edit2, Check, Sparkles,
  Scissors, Plus, Trash2, CalendarOff, X, RotateCcw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import AdminGuard from "../components/admin/AdminGuard";

const SEED_SERVICES = [
  { name: "Box Braids (Medium)", description: "Classic medium-sized box braids", price: 120, duration: 300, category: "braids" },
  { name: "Box Braids (Small)", description: "Small, neat box braids", price: 150, duration: 360, category: "braids" },
  { name: "Knotless Braids (Medium)", description: "Lightweight knotless braids, medium size", price: 130, duration: 300, category: "braids" },
  { name: "Knotless Braids (Small)", description: "Lightweight knotless braids, small size", price: 160, duration: 360, category: "braids" },
  { name: "Goddess Braids", description: "Bohemian style with curly ends", price: 140, duration: 300, category: "braids" },
  { name: "Fulani Braids", description: "Traditional Fulani style with beads", price: 130, duration: 270, category: "braids" },
  { name: "Cornrows (Simple)", description: "Straight-back cornrows", price: 50, duration: 90, category: "cornrows" },
  { name: "Cornrows (Design)", description: "Cornrows with curved or geometric patterns", price: 80, duration: 150, category: "cornrows" },
  { name: "Feed-in Cornrows", description: "Natural-looking feed-in cornrow style", price: 70, duration: 120, category: "cornrows" },
  { name: "Passion Twists", description: "Bohemian passion twists", price: 110, duration: 270, category: "twists" },
  { name: "Senegalese Twists", description: "Sleek and neat Senegalese rope twists", price: 120, duration: 300, category: "twists" },
  { name: "Marley Twists", description: "Full and voluminous Marley twists", price: 100, duration: 240, category: "twists" },
  { name: "Men's Cornrows", description: "Cornrow styles for men", price: 40, duration: 60, category: "men" },
  { name: "Men's Box Braids", description: "Box braids for men", price: 80, duration: 180, category: "men" },
  { name: "Kids' Cornrows", description: "Fun cornrow styles for children", price: 35, duration: 60, category: "kids" },
  { name: "Kids' Box Braids", description: "Box braids for children", price: 60, duration: 150, category: "kids" },
  { name: "Kids' Twists", description: "Twist styles for children", price: 50, duration: 120, category: "kids" },
];

const CATEGORIES = ["braids", "cornrows", "twists", "men", "kids"];

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const TABS = [
  { key: "bookings", label: "Bookings", icon: CalendarDays },
  { key: "services", label: "Services", icon: Scissors },
  { key: "blocked", label: "Blocked Dates", icon: CalendarOff },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
              Booking <span className="italic font-light">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage appointments, services and availability</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === key
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "blocked" && <BlockedDatesTab />}
        </div>
      </div>
    </AdminGuard>
  );
}

/* ─────────────── BOOKINGS TAB ─────────────── */
function BookingsTab() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => entities.Booking.list("-created_at", 200),
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: () => entities.Service.list(),
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }) => entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setEditingBooking(null);
    },
  });

  const deleteBooking = useMutation({
    mutationFn: (id) => entities.Booking.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const clearHistory = async () => {
    const old = bookings.filter(b => b.status === "completed" || b.status === "cancelled");
    for (const b of old) await entities.Booking.delete(b.id);
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    setShowClearConfirm(false);
  };

  const updateStatus = (id, status) => updateBooking.mutate({ id, data: { status } });

  const openEdit = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      client_name: booking.client_name,
      email: booking.email,
      phone: booking.phone,
      service_id: booking.service_id,
      service_name: booking.service_name,
      date: booking.date,
      time: booking.time,
      location: booking.location || "",
      notes: booking.notes || "",
      status: booking.status,
    });
  };

  const saveEdit = () => {
    const service = services.find(s => s.id === editForm.service_id);
    updateBooking.mutate({
      id: editingBooking.id,
      data: { ...editForm, service_name: service?.name || editForm.service_name },
    });
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.client_name?.toLowerCase().includes(q) ||
      b.service_name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q) ||
      b.phone?.includes(q);
    return matchStatus && matchSearch;
  });

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { status: "pending",   icon: Clock,       label: "Pending" },
          { status: "confirmed", icon: CheckCircle, label: "Confirmed" },
          { status: "completed", icon: Check,       label: "Completed" },
          { status: "cancelled", icon: XCircle,     label: "Cancelled" },
        ].map(({ status, icon: Icon, label }) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`bg-card border rounded-xl p-4 text-left transition-all hover:shadow-md ${
              statusFilter === status ? "border-primary ring-1 ring-primary/20" : "border-border"
            }`}
          >
            <Icon size={18} className="text-muted-foreground mb-2" />
            <p className="font-heading text-2xl font-semibold">{counts[status] || 0}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, service, or email…" className="pl-9 rounded-lg bg-card" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {FILTER_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && counts[tab.key] > 0 && (
                <span className={`ml-1.5 text-xs ${statusFilter === tab.key ? "opacity-70" : "text-muted-foreground"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
          {(counts["completed"] > 0 || counts["cancelled"] > 0) && (
            <button onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all bg-card">
              <RotateCcw size={13} /> Clear History
            </button>
          )}
        </div>
      </div>

      {/* Bookings list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5">
              <Skeleton className="h-5 w-48 mb-3" /><Skeleton className="h-4 w-64" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-20 text-center">
          <p className="text-muted-foreground">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((booking) => (
              <BookingRow key={booking.id} booking={booking} onUpdateStatus={updateStatus}
                onEdit={openEdit} isPending={updateBooking.isPending && updateBooking.variables?.id === booking.id} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Clear History Confirm */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">Clear Booking History?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete all <strong>completed</strong> and <strong>cancelled</strong> bookings
            ({(counts["completed"] || 0) + (counts["cancelled"] || 0)} total). This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button onClick={clearHistory} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Client Name</Label>
                <Input value={editForm.client_name || ""} onChange={e => setEditForm({ ...editForm, client_name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Status</Label>
                <Select value={editForm.status} onValueChange={v => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Email</Label>
                <Input type="email" value={editForm.email || ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Phone</Label>
                <Input value={editForm.phone || ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Date</Label>
                <Input type="date" value={editForm.date || ""} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Time</Label>
                <Input value={editForm.time || ""} onChange={e => setEditForm({ ...editForm, time: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Location</Label>
                <Select value={editForm.location || ""} onValueChange={v => setEditForm({ ...editForm, location: v })}>
                  <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Liverpool">Liverpool</SelectItem>
                    <SelectItem value="Walsall">Walsall</SelectItem>
                    <SelectItem value="Birmingham">Birmingham</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-1 block text-muted-foreground">Service</Label>
              <Select value={editForm.service_id} onValueChange={v => setEditForm({ ...editForm, service_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} — £{s.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block text-muted-foreground">Notes</Label>
              <Textarea value={editForm.notes || ""} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} className="h-20" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={updateBooking.isPending} className="bg-primary hover:bg-primary/90">
              {updateBooking.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BookingRow({ booking, onUpdateStatus, onEdit, isPending }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
    >
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0 w-14 text-center hidden md:block">
          {booking.date && (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {format(parseISO(booking.date), "MMM")}
              </p>
              <p className="font-heading text-2xl font-semibold leading-none">
                {format(parseISO(booking.date), "d")}
              </p>
              <p className="text-xs text-muted-foreground">{booking.time}</p>
            </>
          )}
        </div>
        <div className="hidden md:block w-px h-10 bg-border flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground truncate">{booking.client_name}</p>
            <Badge className={`text-xs border ${cfg.color} font-medium`} variant="outline">{cfg.label}</Badge>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-sm text-muted-foreground">
            <span className="font-heading text-foreground/80">{booking.service_name}</span>
            <span className="md:hidden flex items-center gap-1">
              <CalendarDays size={12} />
              {booking.date && format(parseISO(booking.date), "d MMM")} · {booking.time}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {booking.status === "pending" && (
            <>
              <Button size="sm" onClick={() => onUpdateStatus(booking.id, "confirmed")} disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full text-xs px-4 h-8">
                <CheckCircle size={13} className="mr-1" /> Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={() => onUpdateStatus(booking.id, "cancelled")} disabled={isPending}
                className="text-red-600 border-red-200 hover:bg-red-50 rounded-full text-xs px-4 h-8">
                <XCircle size={13} className="mr-1" /> Cancel
              </Button>
            </>
          )}
          {booking.status === "confirmed" && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(booking.id, "completed")} disabled={isPending}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full text-xs px-4 h-8">
              <Check size={13} className="mr-1" /> Complete
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onEdit(booking)}
            className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Edit2 size={14} />
          </Button>
          <button onClick={() => setExpanded(!expanded)}
            className="p-1 text-muted-foreground hover:text-foreground transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1 border-t border-border/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={13} />
                <a href={`mailto:${booking.email}`} className="hover:text-primary transition-colors">{booking.email}</a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={13} />
                <a href={`tel:${booking.phone}`} className="hover:text-primary transition-colors">{booking.phone}</a>
              </div>
              {booking.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays size={13} />
                  <span>📍 {booking.location}</span>
                </div>
              )}
              {booking.notes && (
                <div className="flex items-start gap-2 text-muted-foreground md:col-span-3">
                  <StickyNote size={13} className="mt-0.5 flex-shrink-0" />
                  <span>{booking.notes}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────── SERVICES TAB ─────────────── */
function ServicesTab() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "", category: "braids" });
  const [seedDone, setSeedDone] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => entities.Service.list(),
  });

  const createService = useMutation({
    mutationFn: (data) => entities.Service.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["services"] }); resetForm(); },
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }) => entities.Service.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["services"] }); resetForm(); },
  });

  const deleteService = useMutation({
    mutationFn: (id) => entities.Service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", duration: "", category: "braids" });
    setShowForm(false);
    setEditingService(null);
  };

  const openEdit = (svc) => {
    setEditingService(svc);
    setForm({ name: svc.name, description: svc.description || "", price: svc.price, duration: svc.duration, category: svc.category || "braids" });
    setShowForm(true);
  };

  const handleSubmit = () => {
    const payload = { ...form, price: Number(form.price), duration: Number(form.duration) };
    if (editingService) {
      updateService.mutate({ id: editingService.id, data: payload });
    } else {
      createService.mutate(payload);
    }
  };

  const seedServices = async () => {
    setSeeding(true);
    for (const svc of SEED_SERVICES) await entities.Service.create(svc);
    queryClient.invalidateQueries({ queryKey: ["services"] });
    setSeeding(false);
    setSeedDone(true);
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = services.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{services.length} services total</p>
        <div className="flex gap-2">
          {services.length === 0 && (
            <Button variant="outline" onClick={seedServices} disabled={seeding || seedDone}
              className="rounded-full gap-2 text-sm">
              <Sparkles size={14} />
              {seeding ? "Adding…" : seedDone ? "Done!" : "Add Default Services"}
            </Button>
          )}
          <Button onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2 text-sm">
            <Plus size={14} /> Add Service
          </Button>
        </div>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-primary/30 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold">{editingService ? "Edit Service" : "New Service"}</h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-xs mb-1 block text-muted-foreground">Service Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Knotless Braids (Large)" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs mb-1 block text-muted-foreground">Description</Label>
                <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Price (£) *</Label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 120" />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Duration (minutes) *</Label>
                <Input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 300" />
              </div>
              <div>
                <Label className="text-xs mb-1 block text-muted-foreground">Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}
                disabled={!form.name || !form.price || !form.duration || createService.isPending || updateService.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                {createService.isPending || updateService.isPending ? "Saving…" : editingService ? "Save Changes" : "Add Service"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : services.length === 0 ? (
        <div className="bg-card border border-border rounded-xl py-20 text-center">
          <Scissors size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No services yet. Add one above or use the default services.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(cat => grouped[cat]?.length > 0 && (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </h3>
              <div className="space-y-2">
                {grouped[cat].map(svc => (
                  <div key={svc.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{svc.name}</p>
                      {svc.description && <p className="text-sm text-muted-foreground truncate">{svc.description}</p>}
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={13} /> {svc.duration}m</span>
                      <span className="font-heading text-lg font-semibold text-foreground">£{svc.price}</span>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(svc)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="ghost"
                        onClick={() => window.confirm(`Delete "${svc.name}"?`) && deleteService.mutate(svc.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── BLOCKED DATES TAB ─────────────── */
function BlockedDatesTab() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState("");

  const { data: blockedDates = [], isLoading } = useQuery({
    queryKey: ["blocked_dates"],
    queryFn: () => entities.BlockedDate.list(),
  });

  const blockDate = useMutation({
    mutationFn: (data) => entities.BlockedDate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked_dates"] });
      setSelectedDate(null);
      setReason("");
    },
  });

  const unblockDate = useMutation({
    mutationFn: (id) => entities.BlockedDate.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blocked_dates"] }),
  });

  const blockedSet = new Set(blockedDates.map(d => d.date));

  const handleBlock = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (blockedSet.has(dateStr)) return;
    blockDate.mutate({ date: dateStr, reason: reason || "Unavailable" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">Block a Date</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select a date you're not available. Clients won't be able to book on blocked dates.
        </p>
        <div className="bg-card border border-border rounded-xl p-4 flex justify-center mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            fromDate={new Date()}
            modifiers={{ blocked: blockedDates.map(d => parseISO(d.date)) }}
            modifiersClassNames={{ blocked: "line-through opacity-40 cursor-not-allowed" }}
            className="font-body"
          />
        </div>
        {selectedDate && !blockedSet.has(format(selectedDate, "yyyy-MM-dd")) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div>
              <Label className="text-xs mb-1 block text-muted-foreground">Reason (optional)</Label>
              <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Holiday, personal appointment…" />
            </div>
            <Button onClick={handleBlock} disabled={blockDate.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
              <CalendarOff size={15} className="mr-2" />
              Block {format(selectedDate, "d MMMM yyyy")}
            </Button>
          </motion.div>
        )}
        {selectedDate && blockedSet.has(format(selectedDate, "yyyy-MM-dd")) && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            This date is already blocked.
          </p>
        )}
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">Blocked Dates</h3>
        {isLoading ? (
          <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : blockedDates.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-12 text-center">
            <CalendarOff size={28} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No dates blocked yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...blockedDates]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(d => (
                <div key={d.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{format(parseISO(d.date), "EEEE, d MMMM yyyy")}</p>
                    {d.reason && <p className="text-xs text-muted-foreground">{d.reason}</p>}
                  </div>
                  <Button size="sm" variant="ghost"
                    onClick={() => unblockDate.mutate(d.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600">
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
