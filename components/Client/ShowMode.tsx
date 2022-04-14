import { useState, forwardRef } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import DisplaClientInfo from "@components/Client/DisplayClientInfo";
import DisplayClientMeeting from "@components/Client/DisplayClientMeeting";

export interface SnackBarState extends SnackbarOrigin {
  open: boolean;
}

interface TodoWork {
  _id: string;
  date: Date | null;
  work: string;
}

export default function ShowMode(props: any) {
  const router = useRouter();
  /* Lifting State up to the main component */
  function handleEditMode(): void {
    props.setEditMode(!props.editMode);
  }

  /* Insert to db */
  const defaultFormValues: TodoWork = {
    _id: props.client._id,
    date: new Date(),
    work: props.client.work,
  };

  /* Display the snackbar with default value */
  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [newMeeting, setNewMeeting] = useState(defaultFormValues);
  // Snackbar state
  const [snackBarOpen, setSnackBarOpen] = useState<SnackBarState>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = snackBarOpen;
  const [displayMessage, setDisplayMessage] = useState(
    "Une erreur est intervenue veuillez réessayer !"
  );
  const [timeValue, setTimeValue] = useState<Date | null>(new Date());

  const handleClose = () => {
    setSnackBarOpen({ ...snackBarOpen, open: false });
  };

  /* Handle form input change */
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewMeeting({
      ...newMeeting,
      [name]: value,
    });
  };

  /* Handle the date to be human readable */
  const handleDateChange = (getDate: Date | null) => {
    if (getDate !== null) {
      const minutes =
        (getDate.getMinutes() < 10 ? "0" : "") + getDate.getMinutes();
      const date =
        getDate.getDate() +
        "/" +
        (getDate.getMonth() + 1) +
        "/" +
        getDate.getFullYear() +
        " - " +
        getDate.getHours() +
        ":" +
        minutes;
      setTimeValue(getDate);
      const { name, value } = { name: "date", value: date };
      setNewMeeting({
        ...newMeeting,
        [name]: value,
      });
      console.log(date);
      console.log(newMeeting);
    }
  };

  // Delete the client
  const handleDeleteClient = async () => {
    const response = await fetch("/api/connectDB", {
      method: "DELETE",
      body: JSON.stringify(defaultFormValues),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();

    if (data.success === true) {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage("Le client a bien été supprimé.");
      router.push("/");
    } else {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage("Une erreur : " + data.message + " est survenue");
    }
  };

  /* Insert new meeting event */
  async function clickHandler(): Promise<void> {
    // store form data
    const response = await fetch("/api/InsertNewWork", {
      method: "POST",
      body: JSON.stringify(newMeeting),
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();

    if (data.success === true) {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage("Un RDV a bien été ajouté.");
      router.reload();
    } else {
      setSnackBarOpen({ open: true, vertical: "top", horizontal: "center" });
      setDisplayMessage("Une erreur : " + data.message + " est survenue");
    }
  }

  console.log(props);
  return (
    <>
      <main className="flex w-full flex-col gap-2 xl:flex-row">
        <DisplaClientInfo client={props.client} />

        <DisplayClientMeeting
          work={props.work}
          newMeeting={newMeeting}
          setSnackBarOpen={handleClose}
          snackBarOpen={snackBarOpen}
          setDisplayMessage={setDisplayMessage}
        />

        <section className="flex h-screen basis-[20%] flex-col gap-5 bg-slate-200 py-20 px-5">
          <h2 className="mb-5 text-2xl font-bold">Ajouter un RDV :</h2>
          <Box
            onSubmit={clickHandler}
            component="form"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      name="date"
                      required={true}
                      onChange={handleInputChange}
                    />
                  )}
                  label="Choisir une date"
                  value={timeValue}
                  inputFormat="dd/MM/yyyy - HH:mm"
                  disablePast={false}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
              <TextField
                id="work"
                name="work"
                label="Travail à faire"
                variant="outlined"
                placeholder="Travail à faire"
                onChange={handleInputChange}
                defaultValue={newMeeting.work}
                required={true}
              />
              <Button
                variant="contained"
                color="primary"
                className="bg-slate-800"
                type="submit"
              >
                Ajouter
              </Button>
            </div>
          </Box>
          <Button
            variant="contained"
            className="bg-slate-800"
            onClick={handleEditMode}
          >
            Modifier les informations client
          </Button>
          <Button
            variant="contained"
            className="bg-slate-800"
            onClick={handleDeleteClient}
          >
            Supprimer le client
          </Button>
        </section>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {displayMessage}
          </Alert>
        </Snackbar>
      </main>
    </>
  );
}
