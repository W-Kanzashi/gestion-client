/* Import MUI table */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";

export default function DisplayAllClient(props: any) {
  /* Filter by firstname or/and lastname */
  const filteredData = props.clients.filter((e: any) => {
    if (props.firstname === "" && props.lastname === "") {
      /* Return the whole object */
      return e;
    } else {
      /* Return if user input matches the filter */
      return (
        e.lastname.toLowerCase().includes(props.lastname) &&
        e.firstname.toLowerCase().includes(props.firstname)
      );
    }
  });

  const history = useRouter();
  const handleRowClick = (row: string) => {
    history.push(`/Client/${encodeURIComponent(row)}`);
  };

  return (
    <>
      <TableContainer
        className="max-h-[40vh] xl:max-h-[90vh]"
        component={Paper}
      >
        <Table aria-label="table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row: any) => (
              <TableRow onClick={() => handleRowClick(row._id)} key={row._id}>
                <TableCell>{row.lastname}</TableCell>
                <TableCell>{row.firstname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
