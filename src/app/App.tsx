import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING_SOFT, EASE_PAPER } from "./motion-presets";
import { Toaster, toast } from "sonner";
import type { Ticket, CategoryId } from "./types";
import {
  loadTickets,
  saveTickets,
  nextSerial,
  rollTier,
  pickMessage,
  pickPoem,
  pickMotif,
} from "./data";
import { HomeScreen } from "./components/HomeScreen";
import { RecordScreen } from "./components/RecordScreen";
import { RevealScreen } from "./components/RevealScreen";
import { TicketBook } from "./components/TicketBook";
import { TicketDetail } from "./components/TicketDetail";
import { MeScreen } from "./components/MeScreen";
import { ShareCard } from "./components/ShareCard";
import { BottomNav, type NavTab } from "./components/BottomNav";

type View =
  | { kind: "home" }
  | { kind: "record" }
  | { kind: "reveal"; ticket: Ticket }
  | { kind: "book" }
  | { kind: "me" }
  | { kind: "detail"; id: string };

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [view, setView] = useState<View>({ kind: "home" });
  const [shareTicket, setShareTicket] = useState<Ticket | null>(
    null,
  );

  useEffect(() => {
    setTickets(loadTickets());
  }, []);
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  const tab: NavTab =
    view.kind === "book"
      ? "book"
      : view.kind === "me"
        ? "me"
        : "home";

  const handleSubmit = ({
    category,
    description,
    mood,
  }: {
    category: CategoryId;
    description: string;
    mood: number;
  }) => {
    const tier = rollTier();
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      serial: nextSerial(),
      category,
      description,
      mood,
      tier,
      message: pickMessage(category),
      poem: pickPoem(category),
      createdAt: Date.now(),
      scratched: false,
      motif: pickMotif(),
    };
    setView({ kind: "reveal", ticket });
  };

  const fileTicket = (t: Ticket) => {
    const final = { ...t, scratched: true };
    setTickets((prev) => [final, ...prev]);
    setView({ kind: "home" });
    if (t.tier === "legendary") {
      toast.success("传奇典藏已入册", {
        description: `№ ${t.serial}`,
        duration: 3500,
      });
    } else if (t.tier === "epic") {
      toast.success("珍奇票券已入册", {
        description: `№ ${t.serial}`,
      });
    } else {
      toast(`${t.serial} 已入册`, { duration: 2200 });
    }
  };

  const onTabChange = (t: NavTab) => {
    if (t === "home") setView({ kind: "home" });
    else if (t === "book") setView({ kind: "book" });
    else setView({ kind: "me" });
  };

  const renderView = () => {
    switch (view.kind) {
      case "home":
        return (
          <HomeScreen
            tickets={tickets}
            onRecord={() => setView({ kind: "record" })}
            onOpenTicket={(id) =>
              setView({ kind: "detail", id })
            }
          />
        );
      case "record":
        return (
          <RecordScreen
            onCancel={() => setView({ kind: "home" })}
            onSubmit={handleSubmit}
          />
        );
      case "reveal":
        return (
          <RevealScreen
            ticket={view.ticket}
            onSave={() => fileTicket(view.ticket)}
            onShare={() => setShareTicket(view.ticket)}
          />
        );
      case "book":
        return (
          <TicketBook
            tickets={tickets}
            onOpen={(id) => setView({ kind: "detail", id })}
          />
        );
      case "me":
        return <MeScreen tickets={tickets} />;
      case "detail": {
        const t = tickets.find((x) => x.id === view.id);
        if (!t) {
          setView({ kind: "book" });
          return null;
        }
        return (
          <TicketDetail
            ticket={t}
            onBack={() => setView({ kind: "book" })}
            onShare={() => setShareTicket(t)}
            onDelete={() => {
              setTickets((prev) =>
                prev.filter((x) => x.id !== t.id),
              );
              setView({ kind: "book" });
              toast("票券已撤销发行");
            }}
          />
        );
      }
    }
  };

  const showNav =
    view.kind === "home" ||
    view.kind === "book" ||
    view.kind === "me";

  const TAB_ORDER: Record<string, number> = {
    home: 0,
    book: 1,
    me: 2,
  };
  const prevKindRef = useRef<View["kind"]>(view.kind);
  const prevKind = prevKindRef.current;
  useEffect(() => {
    prevKindRef.current = view.kind;
  }, [view.kind]);

  const getTransition = (): {
    initial: any;
    animate: any;
    exit: any;
    transition: any;
  } => {
    const k = view.kind;
    const p = prevKind;
    // record: slide up like a drawer
    if (k === "record")
      return {
        initial: { y: "100%", opacity: 0.6 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0.4 },
        transition: { duration: 0.45, ease: EASE_PAPER },
      };
    if (p === "record")
      return {
        initial: { y: "100%", opacity: 0.6 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 0, opacity: 0 },
        transition: { duration: 0.4, ease: EASE_PAPER },
      };
    // reveal: zoom-in cinematic
    if (k === "reveal")
      return {
        initial: { scale: 0.92, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.04, opacity: 0 },
        transition: SPRING_SOFT,
      };
    // detail: push from right
    if (k === "detail")
      return {
        initial: { x: "100%", opacity: 0.5 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "30%", opacity: 0 },
        transition: { duration: 0.38, ease: EASE_PAPER },
      };
    if (p === "detail")
      return {
        initial: { x: "-15%", opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: "100%", opacity: 0.5 },
        transition: { duration: 0.38, ease: EASE_PAPER },
      };
    // tab switches: horizontal based on order
    if (k in TAB_ORDER && p in TAB_ORDER) {
      const dir = TAB_ORDER[k] > TAB_ORDER[p] ? 1 : -1;
      return {
        initial: { x: dir * 40, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -dir * 40, opacity: 0 },
        transition: { duration: 0.32, ease: EASE_PAPER },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.25 },
    };
  };
  const trans = getTransition();

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#1a0e08" }}
    >
      {/* phone-like frame */}
      <div
        className="relative h-full w-full max-w-[440px] overflow-hidden"
        style={{
          background: "var(--paper)",
          boxShadow: "0 0 60px rgba(0,0,0,0.4)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={
              view.kind +
              (view.kind === "detail" ? view.id : "")
            }
            initial={trans.initial}
            animate={trans.animate}
            exit={trans.exit}
            transition={trans.transition}
            className="absolute inset-0"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        {showNav && (
          <BottomNav active={tab} onChange={onTabChange} />
        )}

        <AnimatePresence>
          {shareTicket && (
            <ShareCard
              ticket={shareTicket}
              onClose={() => setShareTicket(null)}
            />
          )}
        </AnimatePresence>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--ink)",
              color: "var(--bone)",
              border: "1px solid var(--gold)",
              fontFamily: "var(--font-serif-cn)",
            },
          }}
        />
      </div>
    </div>
  );
}