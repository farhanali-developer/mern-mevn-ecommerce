import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import TablePagination from '@mui/material/TablePagination';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import axios from 'axios'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const gridContainer = {
  height: "400px",
  maxHeight: "400px"
};

export default function AllProducts() {

    const [Products, setProducts] = useState([])
    const [pageProps, setPageProps] = useState({})
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const fetchData = async (limit, page) => {
      try {
          const url = `?limit=${limit}&page=${page}`;
          const res = await axios.get(url);
          if(res){
            const {results, ...props} = res.data
            setProducts(results);
            setPageProps(props)
          }
          
        } catch (error) {
          console.log("error", error);
        }
      };

    useEffect(() => {
      if(page >= 1 && rowsPerPage >= 12){
        fetchData(rowsPerPage, page);
      }
    }, [page, rowsPerPage]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        // setPage(0);
    };

  return (
    <ThemeProvider theme={darkTheme}>
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 5 }}>
          <TablePagination
              style={{ background: "lightseagreen"}}
              component="div"
              count={pageProps?.totalProducts || 1}
              page={page || 1}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[12,24,36,48,60,72,84,96]}
              
          />
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{py:4}}>
          {Products?.map((data) => {
            const title = data?.title;
            const length = 10;
            // const trimmedString = title.substring(0, length);
            // const trimmedString = title.replace(/(.{7})..+/, "$1…");;
              return(
                  <Grid item xs={12} md={3} style={{ overflow: "none"}} key={data?._id} sx={{mt:4}}>
                    <Link to={`/product/${data?._id}`} style={{textDecoration: "none"}}>
                      <Box sx={gridContainer} className="box-shadow" >
                        <img style={{ height: "300px", width: "100%", objectFit: "cover", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} src={`${data?.thumbnail}`} alt="Product" />
                        <h2 style={{ textAlign: "center", fontSize: "16px", color: "#fff", marginTop: "20px" }}>{title}</h2>
                        <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                            <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>{data?.salePrice}</s>
                            <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>{data?.price}</span>
                        </div>
                      </Box>
                    </Link>
                  </Grid>
              )
          })}
        </Grid>
      </Box>
    </Container>
    </ThemeProvider>

  );
}