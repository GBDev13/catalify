import { Router } from "next/router";
import { useEffect } from "react";

export const useUnsavedChangesWarning = (unsavedChanges: boolean, callback: () => boolean = () => confirm('Você tem certeza que deseja sair? As alterações não salvas serão perdidas.')) => {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = unsavedChanges;
      return unsavedChanges;
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [unsavedChanges]);


  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = callback()
        if (!ok) {
          Router.events.emit("routeChangeError")
          throw "Abort route change. Please ignore this error."
        }
      }
      Router.events.on("routeChangeStart", routeChangeStart)

      return () => {
        Router.events.off("routeChangeStart", routeChangeStart)
      }
    }
  }, [unsavedChanges])
}