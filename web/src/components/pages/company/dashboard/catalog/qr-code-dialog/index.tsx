import { ReactNode, useMemo, useRef } from "react"
import { Dialog } from "src/components/ui/Dialog"
import { useCompany } from "src/store/company"
import QRCode from "react-qr-code";
import { LOCALHOST_URL } from "src/constants/config";
import { Logo } from "src/assets/Logo";
import { Button } from "src/components/ui/Button";
import { FiDownloadCloud } from "react-icons/fi";
import { exportAsImage } from "src/helpers/export-as-image";
import { useBreakpoint } from "src/hooks/useBreakpoint";
import { checkColorReadability } from "src/helpers/check-color-readability";
import { darken } from "polished";

type QRCodeDialogProps = {
  children: ReactNode
}

const QRCodeDialogContent = () => {
  const { company } = useCompany()

  const catalogUrl = useMemo(() => {
    return process.env.NODE_ENV === "development" ? `http://${company?.slug}.${LOCALHOST_URL}` : `https://${company?.slug}.catalify.com.br`
  }, [company?.slug])

  const QRCodeRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if(!QRCodeRef.current) return
    exportAsImage(QRCodeRef.current, `${company?.slug}-qrcode`)
  }

  const isMobile = useBreakpoint(640)

  const companyColor = company?.themeColor!;

  const readableColor = checkColorReadability(companyColor, '#fff', darken(0.5, companyColor))

  return (
    <div className="flex flex-col items-center">
      <section ref={QRCodeRef} className="w-full mx-auto sm:max-w-[400px] h-[550px] sm:h-[600px] flex flex-col items-center justify-between pt-8 p-4" style={{ background: companyColor }}>
        <h2 className="text-2xl font-semibold" style={{ color: readableColor }}>
          {company?.name}
        </h2>

          <div className="rounded-lg w-max p-4" style={{ background: readableColor }}>
            <QRCode
              value={catalogUrl}
              size={isMobile ? 200 : 250}
              fgColor={companyColor}
              bgColor={readableColor}
            />
          </div>

          <p className="text-lg text-center px-5 sm:px-10" style={{ color: readableColor }}>
            Escaneie o QR Code para acessar o catálogo
          </p>

        <Logo className="opacity-70 w-[80px]" style={{ color: readableColor }} />
      </section>

      <Button size="WIDE" className="mx-auto max-w-[400px] mt-4" onClick={downloadQRCode}>
        <FiDownloadCloud />
        Baixar QR Code
      </Button>
    </div>
  )
}

export const QRCodeDialog = ({ children }: QRCodeDialogProps) => {
  return (
    <Dialog title="QR Code" maxWidth="500px" content={<QRCodeDialogContent />}>
      {children}
    </Dialog>
  )
}