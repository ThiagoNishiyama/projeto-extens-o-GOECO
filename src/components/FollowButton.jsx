import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function FollowButton({ targetEmail, currentUser }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !targetEmail || currentUser.email === targetEmail) return;
    base44.entities.Follow.filter({ follower_email: currentUser.email, following_email: targetEmail }).then((res) => {
      setIsFollowing(res.length > 0);
    });
  }, [currentUser, targetEmail]);

  if (!currentUser || currentUser.email === targetEmail) return null;

  const handleToggle = async () => {
    setLoading(true);
    if (isFollowing) {
      const follows = await base44.entities.Follow.filter({ follower_email: currentUser.email, following_email: targetEmail });
      if (follows[0]) await base44.entities.Follow.delete(follows[0].id);
      setIsFollowing(false);
      toast.success("Deixou de seguir");
    } else {
      await base44.entities.Follow.create({ follower_email: currentUser.email, following_email: targetEmail });
      // Criar notificação para quem foi seguido
      await base44.entities.Notification.create({
        user_email: targetEmail,
        type: "comment",
        title: "Novo seguidor!",
        message: `${currentUser.full_name} começou a te seguir. 👥`,
        from_user: currentUser.email,
        read: false,
      });
      setIsFollowing(true);
      toast.success("Seguindo! 👥");
    }
    setLoading(false);
  };

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggle}
      disabled={loading}
      className="gap-1.5"
    >
      {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
      {isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}