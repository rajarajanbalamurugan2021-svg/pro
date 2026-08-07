import { useEffect, useRef } from 'react';

interface AndroidBackButtonProps {
  isAiOpen: boolean;
  setIsAiOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  addToast?: (toast: { title: string; message: string; type: 'info' | 'warning' }) => void;
}

export function useAndroidBackButton({
  isAiOpen,
  setIsAiOpen,
  isDrawerOpen,
  setIsDrawerOpen,
  activeModule,
  setActiveModule,
  addToast
}: AndroidBackButtonProps) {
  const historyStack = useRef<string[]>(['placement']);
  const lastExitPressTime = useRef<number>(0);

  // Maintain module history stack
  useEffect(() => {
    if (activeModule) {
      const currentStack = historyStack.current;
      if (currentStack[currentStack.length - 1] !== activeModule) {
        historyStack.current.push(activeModule);
        // Push state to browser window history
        if (typeof window !== 'undefined' && window.history) {
          window.history.pushState({ module: activeModule }, '', `#${activeModule}`);
        }
      }
    }
  }, [activeModule]);

  // Android Back Button listener
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 1. Priority 1: Close open AI Chatbot
      if (isAiOpen) {
        setIsAiOpen(false);
        return;
      }

      // 2. Priority 2: Check for active custom modal elements
      const openModalCloseBtn = document.querySelector<HTMLButtonElement>('[data-modal-close="true"]');
      if (openModalCloseBtn) {
        openModalCloseBtn.click();
        return;
      }

      // 3. Priority 3: Close navigation drawer
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }

      // 4. Priority 4: Navigate to previous module in history stack
      if (historyStack.current.length > 1) {
        historyStack.current.pop(); // Remove current
        const previousModule = historyStack.current[historyStack.current.length - 1] || 'dashboard';
        setActiveModule(previousModule);
        return;
      }

      // 5. Priority 5: Double tap to exit on root page
      const now = Date.now();
      if (now - lastExitPressTime.current < 2000) {
        // Allow default exit/back behavior
      } else {
        lastExitPressTime.current = now;
        if (addToast) {
          addToast({
            title: 'CKCET CAMPRO Mobile',
            message: 'Press Back button again to exit application',
            type: 'info'
          });
        }
        // Push dummy state to prevent immediate exit
        window.history.pushState({ root: true }, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAiOpen, isDrawerOpen, activeModule, setIsAiOpen, setIsDrawerOpen, setActiveModule, addToast]);
}
