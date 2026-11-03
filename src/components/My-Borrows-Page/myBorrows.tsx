import Link from "next/link";
import BorrowedBookCard from "./borrowedBookCard";
import type { IBorrow } from "@/lib/types/IBorrow";

const MyBorrows = ({ borrows, now }: { borrows: IBorrow[]; now: number }) => {
  const daysLeft = (borrow: IBorrow) => Math.ceil((new Date(borrow.dueDate).getTime() - now) / 86400000);
  const active = borrows.filter((borrow) => daysLeft(borrow) > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const dueSoon = active.filter((borrow) => daysLeft(borrow) <= 3).length;
  const closest = active[0];

  return (
    <>
      <section aria-label="Borrowing statistics" className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{active.length}</span>
          <p className="text-sm text-[#9badae]">Currently reading</p>
        </div>
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{dueSoon}</span>
          <p className="text-sm text-[#9badae]">Due soon</p>
        </div>
        <div className="flex min-h-28 items-center gap-6 rounded-xl bg-[#172b2c] p-6">
          <span className="font-[family-name:var(--font-dm-serif)] text-4xl text-[#a9e9cd]">{closest ? daysLeft(closest) : "—"}</span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-dm-serif)] text-lg text-[#fffaf1]">Closest return</p>
            <p className="mt-1 text-sm text-[#a9e9cd]">{closest ? `${closest.title} · ${daysLeft(closest)} ${daysLeft(closest) === 1 ? "day" : "days"} left` : "No upcoming returns"}</p>
          </div>
        </div>
      </section>

      {active.length > 0 ? (
        <section aria-label="Your borrowed books" className="mt-10 rounded-xl bg-[#172b2c] p-5 sm:p-7">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-6 pb-3 text-xs uppercase text-[#9badae] md:grid">
            <span>Book</span><span>Borrow date</span><span>Due date</span><span className="min-w-32 text-center">Action</span>
          </div>
          <div className="divide-y divide-white/5">
            {active.map((borrow) => <BorrowedBookCard key={borrow._id} borrow={borrow} daysLeft={daysLeft(borrow)} />)}
          </div>
        </section>
      ) : (
        <div className="mt-10 rounded-xl bg-[#172b2c] p-10 text-center">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-[#fffaf1]">No borrowed books yet</h2>
          <p className="mt-3 text-sm text-[#9badae]">Find your next story in the community library.</p>
          <Link href="/all-books" className="mt-5 inline-flex h-11 items-center rounded-lg bg-[#a9e9cd] px-6 text-sm text-[#102625] hover:bg-[#c4f4dc]">Browse books</Link>
        </div>
      )}
    </>
  );
};

export default MyBorrows;
