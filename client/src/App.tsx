import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SupplementLibrary from "./pages/SupplementLibrary";
import SupplementDetail from "./pages/SupplementDetail";
import AgingPathways from "./pages/AgingPathways";
import SynergyMatrix from "./pages/SynergyMatrix";
import ProtocolBuilder from "./pages/ProtocolBuilder";
import StackAnalysis from "./pages/StackAnalysis";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={SupplementLibrary} />
      <Route path="/library/:slug" component={SupplementDetail} />
      <Route path="/pathways" component={AgingPathways} />
      <Route path="/synergy" component={SynergyMatrix} />
      <Route path="/protocol" component={ProtocolBuilder} />
      <Route path="/analysis" component={StackAnalysis} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
