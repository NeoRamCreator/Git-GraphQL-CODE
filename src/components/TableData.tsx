import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Input, TablePagination, TextField } from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";

import { useSearchRepositoriesQuery } from "../store/apiSlice";

type RepositorySearchProps = {
  // searchTerm: string;
  // sort: string;
};

// function RepositoryList({ searchTerm, sort }: RepositorySearchProps) {
function RepositoryList({}: RepositorySearchProps) {
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectCell, setSelectCell] = React.useState<string | null>("forks");

  const [selectRow, setSelectRow] = React.useState<any>(null);
  const [afterCursor, setAfterCursor] = React.useState<string | null>(null);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("forks");
  const [search, setSearch] = React.useState(false);

  const [triggerSearch, setTriggerSearch] = React.useState(false);

  // const [data, setDate] = React.useState<any>(null);
  // const [error, setError] = React.useState<any>();
  // const [isLoading, setIsLoading] = React.useState<any>();

  // const getData = () => {
  //   const { data, error, isLoading } = useSearchRepositoriesQuery({
  //     queryString: searchTerm,
  //     sort: selectCell,
  //     first: 10,
  //     after: afterCursor,
  //   });
  //   setDate(data);
  //   setError(error);
  //   setIsLoading(isLoading);
  // };
  const { data, error, isLoading } = useSearchRepositoriesQuery(
    {
      queryString: searchTerm,
      sort: selectCell,
      first: 10,
      after: afterCursor,
      // after: null,s
    },
    { skip: !triggerSearch }
  );
  const totalCount = data?.search.repositoryCount || 0;

  React.useEffect(() => {
    // if (data?.search.pageInfo.hasNextPage) {
    //   setAfterCursor(data.search.pageInfo.endCursor);
    // }
    setTriggerSearch(false);
  }, [data]);

  React.useEffect(() => {
    setTriggerSearch(true);
    console.log(triggerSearch);
  }, [selectCell, afterCursor]);

  if (isLoading) return <p>Loading...</p>;

  const handleSort = (id: string) => {
    setSelectCell(id);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    if (data?.search.pageInfo.hasNextPage) {
      setAfterCursor(data.search.pageInfo.endCursor);
      console.log(afterCursor);
    }
  };

  const handleSearchClick = () => {
    setTriggerSearch(true);
  };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#dd5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* <Box sx={{ bgcolor: "#9457EBFF" , m: 1}}> */}
      <Box sx={{ bgcolor: "#00838FFF", p: "19px 32px" }}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поисковый запрос"
          sx={{
            bgcolor: "#F2F2F2FF",
            borderRadius: "4px",
            width: "912px",
            "& .MuiInputBase-input": {
              fontSize: "14px",
              padding: "9px 16px",
            },
          }}
        />
        <Button
          variant="contained"
          sx={{ m: "0 8px" }}
          onClick={handleSearchClick}
        >
          искать
        </Button>
      </Box>

      <Box sx={{ display: "flex", height: "100%", bgcolor: "#6B7F94FF" }}>
        {/* <Box sx={{}}> */}

        <TableContainer
          component={Paper}
          sx={{
            p: "0 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {data && (
              <h1 style={{ padding: 16, fontSize: 48 }}>Результаты поиска</h1>
            )}

            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%" }}>Название</TableCell>
                  <TableCell sx={{ width: "20%" }}>Язык</TableCell>
                  <TableCell
                    sx={{ width: "20%" }}
                    id="forks"
                    onClick={() => handleSort("forks")}
                  >
                    <TableSortLabel
                      sx={{
                        marginLeft: selectCell === "forks" ? "-5px" : "-20px",
                      }}
                      active={selectCell === "forks"}
                      // direction="desc"
                    ></TableSortLabel>
                    Число форков
                  </TableCell>
                  <TableCell
                    sx={{ width: "20%" }}
                    id="stars"
                    onClick={() => handleSort("stars")}
                  >
                    <TableSortLabel
                      sx={{
                        marginLeft: selectCell === "stars" ? "-5px" : "-20px",
                      }}
                      active={selectCell === "stars"}
                    ></TableSortLabel>
                    Число звезд
                  </TableCell>
                  <TableCell
                    sx={{ width: "20%" }}
                    id="updated"
                    onClick={() => handleSort("updated")}
                  >
                    <TableSortLabel
                      sx={{
                        marginLeft: selectCell === "updated" ? "-5px" : "-20px",
                      }}
                      active={selectCell === "updated"}
                    ></TableSortLabel>
                    Дата обновления
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.search.edges?.map((edge: any) => {
                  const node = edge?.node;
                  if (node?.__typename === "Repository") {
                    return (
                      <TableRow
                        onClick={() =>
                          setSelectRow({
                            name: node.name,
                            language: node.primaryLanguage?.name,
                            license: node.LicenseInfo?.name,
                          })
                        }
                        key={node.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <div > */}
                        <TableCell>{node.name}</TableCell>
                        <TableCell>{node.primaryLanguage?.name}</TableCell>
                        <TableCell>{node.forkCount}</TableCell>
                        <TableCell>{node.stargazerCount}</TableCell>
                        <TableCell>
                          {new Date(node.updatedAt).toLocaleDateString()}
                        </TableCell>
                        {/* </div> */}
                      </TableRow>

                      // <div key={node.id} style={{ border: "1px solid" }}>
                      //   <h3>{node.name}</h3>
                      //   <p>{node.description}</p>
                      //   <p>Stars: {node.stargazerCount}</p>
                      //   <p>Forks: {node.forkCount}</p>
                      //   <p>Language: {node.primaryLanguage?.name}</p>
                      //   <p>License: {node.LicenseInfo?.name}</p>
                      //   <p>
                      //     Last updated:{" "}
                      //     {new Date(node.updatedAt).toLocaleDateString()}
                      //   </p>
                      // </div>
                    );
                  }
                  return null;
                })}

                {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.calories}</TableCell>
                  <TableCell>{row.fat}</TableCell>
                  <TableCell>{row.carbs}</TableCell>
                  <TableCell>{row.protein}</TableCell>
                </TableRow>
              ))} */}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={100}
            // count={totalCount}

            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>

        <Box sx={{ width: "33%", bgcolor: "#F2F2F2FF", display: "flex" }}>
          {!selectRow && (
            <Box
              sx={{
                m: "auto",
              }}
            >
              Выберите репозиторий
            </Box>
          )}
          {selectRow && (
            <Box>
              <h2 style={{ margin: "24px 24px 16px 24px", fontSize: 32 }}>
                {selectRow.name}
              </h2>

              <p style={{ margin: "0 24px ", padding: "3px 6px" , color: 'white', backgroundColor: '#2196F3FF', width: 'max-content', borderRadius: 15}}>
                {selectRow.language}
              </p>
              <p style={{ margin: "16px 24px " }}>
                {selectRow.license || "нет лицензии"}
              </p>
            </Box>
          )}
        </Box>
      </Box>
      {/* </Box> */}
      {/* </Box> */}

      <Box height={32} sx={{ bgcolor: "#4F4F4FFF" }}>
        1
      </Box>
    </Box>
  );
}

export default RepositoryList;
