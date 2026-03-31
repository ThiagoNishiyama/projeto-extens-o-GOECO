import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Save, X, Edit } from "lucide-react";
import { getLevelInfo } from "@/lib/levels";
import { Progress } from "@/components/ui/progress";
import FollowersCount from "@/components/FollowersCount";
import FollowButton from "@/components/FollowButton";

function formatName(raw) {
  if (!raw) return "Usuário";
  // Remove email part if it looks like an email
  const name = raw.includes("@") ? raw.split("@")[0] : raw;
  // Replace dots, underscores, hyphens with space and capitalize each word
  return name
    .replace(/[._\-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export default function ProfileHeader({ user, onUserUpdate, isOwner = false, currentUser = null }) {
  const [editingBio, setEditingBio] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [bioValue, setBioValue] = useState(user?.bio || "");
  const [nameValue, setNameValue] = useState(user?.display_name || formatName(user?.full_name));
  const [uploading, setUploading] = useState(null); // "avatar" | "banner" | null

  const avatarInputRef = useRef();
  const bannerInputRef = useRef();

  const levelInfo = getLevelInfo(user?.points || 0);
  const displayName = user?.display_name || formatName(user?.full_name);
  const avatarUrl = user?.avatar_url;
  const bannerUrl = user?.banner_url;

  const handleUpload = async (file, type) => {
    setUploading(type);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const update = type === "avatar" ? { avatar_url: file_url } : { banner_url: file_url };
    await base44.auth.updateMe(update);
    onUserUpdate({ ...user, ...update });
    setUploading(null);
  };

  const saveBio = async () => {
    await base44.auth.updateMe({ bio: bioValue });
    onUserUpdate({ ...user, bio: bioValue });
    setEditingBio(false);
  };

  const saveName = async () => {
    await base44.auth.updateMe({ display_name: nameValue });
    onUserUpdate({ ...user, display_name: nameValue });
    setEditingName(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden border bg-card shadow-sm mb-8">
      {/* Banner */}
      <div className="relative h-32 sm:h-40">
        {bannerUrl ? (
          <img src={bannerUrl} alt="banner" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${levelInfo.color}`} />
        )}
        {isOwner && (
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-1.5 transition-colors"
          >
            {uploading === "banner" ? (
              <span className="animate-pulse">Enviando...</span>
            ) : (
              <><Camera className="w-3.5 h-3.5" /> Banner</>
            )}
          </button>
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "banner")}
        />
      </div>

      {/* Avatar + Info */}
      <div className="px-5 pb-5">
        <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12 sm:-mt-14">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-card overflow-hidden shadow-lg ${!avatarUrl ? `bg-gradient-to-br ${levelInfo.color}` : ""} flex items-center justify-center`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{displayName[0]?.toUpperCase()}</span>
              )}
            </div>
            {isOwner && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                {uploading === "avatar" ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar")}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-14">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Name */}
                {isOwner && editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      className="text-xl font-space font-bold bg-transparent border-b-2 border-primary focus:outline-none w-full max-w-xs"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      maxLength={40}
                      autoFocus
                    />
                    <button onClick={saveName}><Save className="w-4 h-4 text-primary" /></button>
                    <button onClick={() => setEditingName(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="font-space font-bold text-xl sm:text-2xl truncate">{displayName}</h1>
                    {isOwner && (
                      <button onClick={() => setEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${levelInfo.bgColor} ${levelInfo.textColor}`}>
                    {levelInfo.badge} {levelInfo.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user?.points || 0} pts</span>
                </div>
                <div className="mt-2">
                  <FollowersCount email={user?.email} />
                </div>

                {/* Bio */}
                <div className="mt-2">
                  {isOwner && editingBio ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        rows={2}
                        maxLength={200}
                        placeholder="Escreva algo sobre você..."
                        value={bioValue}
                        onChange={(e) => setBioValue(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveBio}><Save className="w-3 h-3 mr-1" /> Salvar</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setBioValue(user?.bio || ""); setEditingBio(false); }}><X className="w-3 h-3 mr-1" /> Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group">
                      {user?.bio ? (
                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                      ) : isOwner ? (
                        <p className="text-sm text-muted-foreground italic">Adicione uma bio...</p>
                      ) : null}
                      {isOwner && (
                        <button onClick={() => setEditingBio(true)} className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0">
                          <Edit className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && <FollowButton targetEmail={user?.email} currentUser={currentUser} />}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{levelInfo.name}</span>
            {levelInfo.nextLevel && <span>{levelInfo.nextLevel.name}</span>}
          </div>
          <Progress value={levelInfo.progress} className="h-2" />
        </div>
      </div>
    </div>
  );
}