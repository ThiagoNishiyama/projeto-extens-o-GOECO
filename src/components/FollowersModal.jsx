import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { getLevelInfo } from "@/lib/levels";

function UserRow({ email, onClose }) {
  const { data: users = [] } = useQuery({
    queryKey: ["userRow", email],
    queryFn: () => base44.entities.User.filter({ email }),
    enabled: !!email,
  });
  const u = users[0];
  const levelInfo = getLevelInfo(u?.points || 0);
  const name = u?.full_name || email.split("@")[0];

  return (
    <Link
      to={`/usuario?email=${email}`}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 rounded-xl transition-colors"
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${levelInfo.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
        {name[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{levelInfo.badge} {levelInfo.name} • {u?.points || 0} pts</p>
      </div>
    </Link>
  );
}

export default function FollowersModal({ email, defaultTab = "followers", open, onClose }) {
  const { data: followers = [] } = useQuery({
    queryKey: ["followers", email],
    queryFn: () => base44.entities.Follow.filter({ following_email: email }),
    enabled: !!email && open,
  });

  const { data: following = [] } = useQuery({
    queryKey: ["following", email],
    queryFn: () => base44.entities.Follow.filter({ follower_email: email }),
    enabled: !!email && open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="font-space text-base">Conexões</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full rounded-none border-b bg-transparent h-auto pb-0 px-4">
            <TabsTrigger value="followers" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              Seguidores ({followers.length})
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
              Seguindo ({following.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="mt-0 max-h-80 overflow-y-auto py-2">
            {followers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum seguidor ainda</p>
            ) : followers.map((f) => (
              <UserRow key={f.id} email={f.follower_email} onClose={onClose} />
            ))}
          </TabsContent>
          <TabsContent value="following" className="mt-0 max-h-80 overflow-y-auto py-2">
            {following.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Não segue ninguém ainda</p>
            ) : following.map((f) => (
              <UserRow key={f.id} email={f.following_email} onClose={onClose} />
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}