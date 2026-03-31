import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import FollowersModal from "@/components/FollowersModal";

export default function FollowersCount({ email }) {
  const [modal, setModal] = useState(null); // "followers" | "following" | null

  const { data: followers = [] } = useQuery({
    queryKey: ["followers", email],
    queryFn: () => base44.entities.Follow.filter({ following_email: email }),
    enabled: !!email,
  });

  const { data: following = [] } = useQuery({
    queryKey: ["following", email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: email }),
    enabled: !!email,
  });

  return (
    <>
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => setModal("followers")}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="font-bold">{followers.length}</span>
          <span className="text-muted-foreground">seguidores</span>
        </button>
        <button
          onClick={() => setModal("following")}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <span className="font-bold">{following.length}</span>
          <span className="text-muted-foreground">seguindo</span>
        </button>
      </div>

      <FollowersModal
        email={email}
        defaultTab={modal || "followers"}
        open={!!modal}
        onClose={() => setModal(null)}
      />
    </>
  );
}