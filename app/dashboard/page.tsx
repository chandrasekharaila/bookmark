"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const POSTS = [
  { id: "1", title: "AI Revolution" },
  { id: "2", title: "Crypto Trends" },
  { id: "3", title: "Space Exploration" },
  { id: "4", title: "Web3 Future" },
  { id: "5", title: "Machine Learning" },
  { id: "6", title: "Startup Ecosystem" },
  { id: "7", title: "Blockchain Basics" },
  { id: "8", title: "Cloud Computing" },
  { id: "9", title: "Cyber Security" },
  { id: "10", title: "Data Science" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // check login
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/");
      else setUser(data.user);
    };
    getUser();
  }, []);

  // fetch + realtime
  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_bookmarks" },
        (payload) => {
          console.log("realtime:", payload);

          if (payload.eventType === "INSERT") {
            const newRow = payload.new;
            if (newRow.user_id !== user.id) return;

            setBookmarks((prev) => {
              // avoid duplicates
              if (prev.some((b) => b.id === newRow.id)) return prev;
              return [...prev, newRow];
            });
          }

          if (payload.eventType === "DELETE") {
            const oldRow = payload.old;
            if (oldRow.user_id !== user.id) return;

            setBookmarks((prev) => prev.filter((b) => b.id !== oldRow.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("user_bookmarks")
      .select("*")
      .eq("user_id", user.id);

    if (data) setBookmarks(data);
  };

  const isBookmarked = (postId: string) => {
    return bookmarks.some((b) => b.post_id === postId);
  };

  const addBookmark = async (postId: string) => {
    const { data } = await supabase
      .from("user_bookmarks")
      .insert({
        user_id: user.id,
        post_id: postId,
      })
      .select()
      .single();

    if (data) {
      setBookmarks((prev) => [...prev, data]);
    }
  };

  const removeBookmark = async (postId: string) => {
    const row = bookmarks.find((b) => b.post_id === postId);
    if (!row) return;

    // instant UI update
    setBookmarks((prev) => prev.filter((b) => b.id !== row.id));

    await supabase.from("user_bookmarks").delete().eq("id", row.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Smart Bookmarks</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="space-y-3">
        {POSTS.map((post) => (
          <div
            key={post.id}
            className="border p-4 flex justify-between items-center"
          >
            <p>{post.title}</p>

            {isBookmarked(post.id) ? (
              <button
                onClick={() => removeBookmark(post.id)}
                className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer hover:opacity-80"
              >
                REMOVE
              </button>
            ) : (
              <button
                onClick={() => addBookmark(post.id)}
                className="bg-green-600 text-white px-4 py-1 rounded cursor-pointer hover:opacity-80"
              >
                ADD
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
