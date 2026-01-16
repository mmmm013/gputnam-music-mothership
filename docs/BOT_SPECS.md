# GPMC AUTOMATION: THE BOT ECOSYSTEM
**Status:** DESIGN PHASE
**Objective:** Autonomous Enlivenment of the Platform.

## 1. MC BOT (MUSIC CURATOR)
**Domain:** GPM, MIPs (Scherer, Nelson), Audio Assets.
**Core Functions:**
* **Ingestion:** Detects new uploads in SB `tracks` bucket.
* **Standardization:** Enforces filename conventions.
* **Rotation:** Randomizes the "First Note" playlist daily.

## 2. LF BOT (LEGACY & FARM)
**Domain:** L Cole Farms (LCF), Heroes Page.
**Core Functions:**
* **Preservation:** Monitors "Grandpa's Story" content.
* **Atmosphere:** Adjusts visual themes based on LCF seasonality.

## 3. INTERACTION MATRIX
| Bot | Triggers | Output |
| :--- | :--- | :--- |
| **MC BOT** | New File Upload | Updated Playlist |
| **LF BOT** | Time of Year | Theme Changes |

---
*Specs Locked for Retrieval.*

## 4. USER-COMMAND INTERFACE (2026-01-16)
**Feature:** System Control Bar.
**Function:** Users can manually toggle between Agents.
* **MC.EXE:** Activates Music Curator Mode (High Rotation).
* **LF.EXE:** Activates Legacy/Farm Mode (Story Focus, Wheat Theme).
