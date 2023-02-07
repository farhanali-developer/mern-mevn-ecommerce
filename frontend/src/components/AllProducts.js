import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import TablePagination from '@mui/material/TablePagination';



function Content() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);
    return (
      <Pagination
        page={page}
        count={10}
        renderItem={(item) => (
          <PaginationItem
            style={{ color: "#000" }}
            component={Link}
            to={`/page${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
    );
  }

export default function AllProducts() {

    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

  return (
    <Box sx={{ width: '100%' }} sx={{ m: 2 }}>
        <TablePagination
            style={{ background: "lightseagreen"}}
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
        <Grid item xs={12} md={3} style={{ marginTop: "30px"}}>
             <Box
                sx={{
                    background: "#fff",
                    border: "3px solid #e6e6e6",
                    borderRadius: "0",
                    padding: "10px",
                    position: "relative",
                    transition: "all .35s ease-in-out",
                    '&:hover': {
                    borderColor: '#ee4a00',
                    cursor: "pointer"
                    },
                }}
            >
                <img style={{ height: "auto", width: "100%" }} src="https://lanustech.vercel.app/assets/img/desktops-1.jpg" alt="Product" />
                <h3 style={{ textAlign: "center" }}>Product Title</h3>
                <div style={{ fontWight: "bold", marginTop: "20px", textAlign: "center" }}>
                    <s style={{ fontSize: "1.1rem", color: "#6c757d" }}>$12.00</s>
                    <span style={{ fontSize: "1.1rem", color: "#dc3545", marginLeft: "10px" }}>$8.99</span>
                </div>
            </Box>
        </Grid>
      </Grid>

    <MemoryRouter initialEntries={['/page']} initialIndex={0}>
        <Routes>
            <Route path="*" element={<Content />} />
        </Routes>
    </MemoryRouter>
    </Box>
  );
}