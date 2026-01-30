*** Begin Patch
*** Update File: components/Player/Player.tsx
@@
-'use client';
-
-import React, { useState, useEffect, useRef } from 'react';
+'use client';
+
+import React, { useState, useEffect, useRef, useMemo } from 'react';
@@
-  // Handle Play/Pause side effects
+  // Handle Play/Pause side effects
   useEffect(() => {
     if (audioRef.current) {
       if (isPlaying) {
         audioRef.current.play().catch((err) => console.warn("Play interrupted:", err));
       } else {
         audioRef.current.pause();
       }
     }
   }, [isPlaying, currentTrack]);
 
-  if (!currentTrack) return null;
+  // Compute a display title override for known variants
+  const displayTitle = useMemo(() => {
+    if (!currentTrack?.title) return null;
+    const norm = currentTrack.title.toLowerCase().replace(/[^a-z0-9]/g, '');
+    if (/comin|coming/.test(norm) && /over/.test(norm)) {
+      return 'Torn Memories';
+    }
+    return currentTrack.title;
+  }, [currentTrack]);
+
+  if (!currentTrack) return null;
@@
-            <h3 className="text-white font-medium truncate">{currentTrack.title || 'Unknown Title'}</h3>
+            <h3 className="text-white font-medium truncate">{displayTitle || 'Unknown Title'}</h3>
             <p className="text-sm text-neutral-400 truncate">{currentTrack.artist || 'G Putnam Music'}</p>
           </div>
         </div>
*** End Patch