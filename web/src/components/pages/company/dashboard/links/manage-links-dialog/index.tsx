import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"

const ManageLinksForm = () => {
  return (
    <form>
      <p>manage</p>
    </form>
  )
}

export const ManageLinksDialog = () => {
  return (
    <Dialog content={<ManageLinksForm />} title="Gerenciar Links" maxWidth="800px">
      <Button type="button" variant="OUTLINE" className="mr-auto">Gerenciar Links</Button>
    </Dialog>
  )
}