import { ReactNode } from "react"
import { BsQuestionCircle } from "react-icons/bs"
import { Tooltip } from "../Tooltip"

type TipIconProps = {
  tip: string | ReactNode
  size?: number
  maxWidth?: number
}

export const TipIcon = ({ tip, size = 15, maxWidth = 290 }: TipIconProps) => {
  return (
    <Tooltip content={tip} maxWidth={maxWidth}>
      <div>
        <BsQuestionCircle size={size} />
      </div>
    </Tooltip>
  )
}