import { useState } from "react";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { TableView } from "./components/Table/TableView";
import { HandInputModal } from "./components/HandInput/HandInputModal";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { HistoryLog } from "./components/History/HistoryLog";
import { GameEndScreen } from "./components/GameEnd/GameEndScreen";

type OverlayKind = "hand" | "settings" | "history" | null;

function AppShell() {
  const { state } = useGame();
  const [overlay, setOverlay] = useState<OverlayKind>(null);

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-black">
      <div className="@container h-[min(100vw,100dvh)] w-[min(100vw,100dvh)] p-2">
        <TableView
          onRecordHand={() => setOverlay("hand")}
          onOpenSettings={() => setOverlay("settings")}
          onOpenHistory={() => setOverlay("history")}
        />
      </div>

      {overlay === "hand" && <HandInputModal onClose={() => setOverlay(null)} />}
      {overlay === "settings" && <SettingsPanel onClose={() => setOverlay(null)} />}
      {overlay === "history" && <HistoryLog onClose={() => setOverlay(null)} />}

      {state.isEnded && <GameEndScreen />}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}

export default App;
