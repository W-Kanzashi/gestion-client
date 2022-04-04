import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
/* Display Modal */
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FaTimes } from "react-icons/fa";

interface Modal {
  data: string;
  open: boolean;
}

export default function DisplayClientMeeting(props: any) {
  const router = useRouter();
  /* Display the modal */
  const [openModal, setOpenModal] = useState<Modal>({
    data: "",
    open: false,
  });
  function handleModalOpen(data: string) {
    setOpenModal({ data: data, open: true });
  }
  function handleModalClose() {
    setOpenModal({ data: "", open: false });
  }
  /* Delete Meeting event */
  async function handleModalValidate(): Promise<void> {
    const response = await fetch("/api/InsertNewWork", {
      method: "DELETE",
      body: JSON.stringify(props.newMeeting),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();

    setOpenModal({ data: "", open: false });

    if (data.success === true) {
      props.setSnackBarOpen({
        open: true,
        vertical: "top",
        horizontal: "center",
      });
      props.setDisplayMessage("Le RDV a bien été supprimé");
      router.reload();
    } else {
      props.setSnackBarOpen({
        open: true,
        vertical: "top",
        horizontal: "center",
      });
      props.setDisplayMessage("Une erreur : " + data.message + " est survenue");
    }
  }

  return (
    <>
      {/* Section RDV */}
      <section className="order-first flex h-screen max-h-full basis-[30%] flex-col gap-5 overflow-y-scroll bg-slate-200 py-20 px-5 md:-order-none md:max-h-96">
        {props.work.length === 0 ? (
          <h2 className="text-center text-lg font-semibold">
            Il n&apos;y a pas de RDV
          </h2>
        ) : (
          props.work.map((info: any) => (
            <div
              key={info._id}
              className="flex flex-row items-center justify-around rounded-md border border-slate-800 p-2"
            >
              <div className="basis-[95%]">
                <h2 className="text-underline text-lg font-semibold">
                  RDV Planifié :
                </h2>
                <h3>Date : {info.date}</h3>
                <h3>Travail : {info.work}</h3>
              </div>
              <Button
                onClick={() => handleModalOpen(info.client)}
                color="inherit"
              >
                <FaTimes />
              </Button>
            </div>
          ))
        )}
        <Modal
          open={openModal.open}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="absolute top-1/2 left-1/2 flex h-40 max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-3 rounded-md bg-slate-900 px-5 text-slate-200 shadow-xl">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Valider la suppression
            </Typography>
            <Typography id="modal-modal-description">
              Il ne sera pas possible de récupérer
            </Typography>
            <Button onClick={handleModalValidate}>Supprimer</Button>
          </Box>
        </Modal>
      </section>
    </>
  );
}
