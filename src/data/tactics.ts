import type { Tactics } from "../types/football";

function defaultTactics(clubId: string, firstPlayerId: string, captainId: string): Tactics {
  return {
    clubId, formation: "4-4-2", mentality: "Balanced",
    pressingIntensity: "Medium", defensiveLine: "Standard",
    passingStyle: "Mixed", tempo: "Normal", width: "Standard",
    counterAttack: false,
    playmakerId: firstPlayerId, captainId,
    penaltyTakerId: firstPlayerId, freeKickTakerId: firstPlayerId, cornerTakerId: firstPlayerId,
  };
}

export const tactics: Tactics[] = [
  // Ajax – total football
  {
    clubId: "ajax", formation: "4-3-3", mentality: "Attacking",
    pressingIntensity: "High", defensiveLine: "High",
    passingStyle: "Short", tempo: "Fast", width: "Wide",
    counterAttack: false,
    playmakerId: "ajax-cam1", captainId: "ajax-cb1",
    penaltyTakerId: "ajax-st1", freeKickTakerId: "ajax-cam1", cornerTakerId: "ajax-rw1",
  },
  // PSV – fast transitions
  {
    clubId: "psv", formation: "4-2-3-1", mentality: "Attacking",
    pressingIntensity: "High", defensiveLine: "High",
    passingStyle: "Short", tempo: "Fast", width: "Wide",
    counterAttack: true,
    playmakerId: "psv-cm1", captainId: "psv-cb1",
    penaltyTakerId: "psv-st1", freeKickTakerId: "psv-cam1", cornerTakerId: "psv-rw1",
  },
  // Feyenoord – physical direct
  {
    clubId: "feyenoord", formation: "4-3-3", mentality: "Balanced",
    pressingIntensity: "High", defensiveLine: "Standard",
    passingStyle: "Mixed", tempo: "Normal", width: "Standard",
    counterAttack: true,
    playmakerId: "fey-cam1", captainId: "fey-cb1",
    penaltyTakerId: "fey-st1", freeKickTakerId: "fey-cam1", cornerTakerId: "fey-rw1",
  },
  // User club – grassroots defensive
  {
    clubId: "user-club", formation: "4-4-2", mentality: "Defensive",
    pressingIntensity: "Low", defensiveLine: "Deep",
    passingStyle: "Direct", tempo: "Patient", width: "Narrow",
    counterAttack: true,
    playmakerId: "uc-cm1", captainId: "uc-st1",
    penaltyTakerId: "uc-st1", freeKickTakerId: "uc-cam1", cornerTakerId: "uc-cam1",
  },
  // Other clubs – auto defaults (will be resolved dynamically if needed)
  defaultTactics("az-alkmaar", "az-alkmaar-p7", "az-alkmaar-p1"),
  defaultTactics("utrecht", "utrecht-p7", "utrecht-p1"),
  defaultTactics("twente", "twente-p7", "twente-p1"),
  defaultTactics("vitesse", "vitesse-p7", "vitesse-p1"),
  defaultTactics("groningen", "groningen-p7", "groningen-p1"),
  defaultTactics("heerenveen", "heerenveen-p7", "heerenveen-p1"),
  defaultTactics("sparta-rotterdam", "sparta-rotterdam-p7", "sparta-rotterdam-p1"),
  defaultTactics("nec-nijmegen", "nec-nijmegen-p7", "nec-nijmegen-p1"),
  defaultTactics("heracles", "heracles-p7", "heracles-p1"),
  defaultTactics("fortuna-sittard", "fortuna-sittard-p7", "fortuna-sittard-p1"),
  defaultTactics("go-ahead-eagles", "go-ahead-eagles-p7", "go-ahead-eagles-p1"),
  defaultTactics("excelsior", "excelsior-p7", "excelsior-p1"),
  defaultTactics("cambuur", "cambuur-p7", "cambuur-p1"),
  defaultTactics("rkc-waalwijk", "rkc-waalwijk-p7", "rkc-waalwijk-p1"),
  defaultTactics("almere-city", "almere-city-p7", "almere-city-p1"),
];
