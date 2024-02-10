import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, Skeleton } from '@mui/material'
import { AppContext } from '../../App';
import { ArrowForwardRounded, AttachMoneyRounded, BackpackRounded, CloseRounded, DeleteRounded, ShoppingCartRounded, WarningRounded } from '@mui/icons-material';
import titleHelper from '../../functions/helpers';
import http from '../../http';
import PageHeader from '../../components/PageHeader';
import CardTitle from '../../components/CardTitle';
import InfoBox from '../../components/InfoBox';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';


function ViewCart() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    const [loading, setLoading] = useState(true)
    const [deleteItemDialog, setDeleteItemDialog] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [cart, setCart] = useState(null)
    const [deleteCart, setDeleteCart] = useState(null) // Used to store the id of the cart item to be deleted
    const enqueueSnackbar = useSnackbar()
    const apiUrl = import.meta.env.VITE_API_URL;
    titleHelper("My Cart")

    const getCart = () => {
        http.get("/Shop/Cart").then((res) => {
            if (res.status === 200) {
                setCart(res.data)
                setLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to get cart", { variant: "error" })
        })
    }

    const handleDeleteItemDialogOpen = (item) => {
        setDeleteCart(item)
        setDeleteItemDialog(true)
    }

    const handleDeleteItemDialogClose = () => {
        setDeleteItemDialog(false)
    }

    const handleDeleteItem = () => {
        setDeleteLoading(true)
        http.delete("/Shop/Cart?id=" + deleteCart.id).then((res) => {
            if (res.status === 200) {
                setDeleteLoading(false)
                setDeleteItemDialog(false)
                getCart()
                enqueueSnackbar("Item deleted from cart", { variant: "success" })
            }
        }).catch((err) => {
            setDeleteLoading(false)
            enqueueSnackbar("Failed to delete item from cart", { variant: "error" })
        })
    }

    useEffect(() => {
        getCart()
    }, [])

    return (
        <>
            <PageHeader icon={ShoppingCartRounded} title="My Cart" navTitle="My Cart" />
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <Grid container spacing={2} flexDirection={{ xs: "row-reverse", md: "row" }}>
                    <Grid item xs={12} md={9}>
                        <Stack spacing={"1rem"}>
                            {loading &&
                                <>
                                    <Card>
                                        <CardContent>
                                            <Stack direction={{ sx: "column", md: "row" }} alignItems={"center"} spacing={"1rem"}>
                                                <Skeleton variant="rectangular" width="150px" height="150px" animation="wave" />
                                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                    <Box>
                                                        <Skeleton variant="text" width="50%" animation="wave" />
                                                        <Stack direction={"row"} spacing={"3rem"}>
                                                            <Skeleton variant="text" width="100px" animation="wave" />
                                                            <Skeleton variant="text" width="100px" animation="wave" />
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                                <Skeleton variant="text" width="100px" animation="wave" />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent>
                                            <Stack direction={{ sx: "column", md: "row" }} alignItems={"center"} spacing={"1rem"}>
                                                <Skeleton variant="rectangular" width="150px" height="150px" animation="wave" />
                                                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                    <Box>
                                                        <Skeleton variant="text" width="50%" animation="wave" />
                                                        <Stack direction={"row"} spacing={"3rem"}>
                                                            <Skeleton variant="text" width="100px" animation="wave" />
                                                            <Skeleton variant="text" width="100px" animation="wave" />
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                                <Skeleton variant="text" width="100px" animation="wave" />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </>
                            }
                            {cart && cart.cart.length === 0 &&
                                <Card sx={{ mt: "1rem" }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                            <WarningRounded sx={{ fontSize: 100, color: "black", opacity: "0.5" }} />
                                            <Typography variant="h6" fontWeight={700}>Cart is Empty</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            }
                            {cart && cart.cart.map((item) => (
                                <Card>
                                    <CardContent>
                                        <Stack direction={{ sx: "column", md: "row" }} alignItems={"center"} spacing={"1rem"}>
                                            <img src={item.availability.activity.pictures ? apiUrl + "/uploads/" + item.availability.activity.pictures.items[0] : "/unknown.png"} alt="Activity Image" style={{ width: "150px", height: "auto" }} />
                                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                <Box>
                                                    <Typography variant="h6" fontWeight={"700"}>{item.availability.activity.name}</Typography>
                                                    <Stack direction={"row"} spacing={"3rem"}>
                                                        <InfoBox title="Pax" value={item.pax} />
                                                        <InfoBox title="Activity Date" value={moment(item.availability.date).format("DD/MM/YYYY")} />
                                                    </Stack>

                                                </Box>
                                            </Box>
                                            <Typography variant="h6" fontWeight={700}>${(item.availability.price * item.pax).toFixed(2)}</Typography>
                                        </Stack>
                                        <Box display={"flex"} mt={"1rem"}>
                                            <Button variant="secondary" onClick={() => handleDeleteItemDialogOpen(item)} startIcon={<DeleteRounded />}>Remove</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}

                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <CardTitle title="Cart Summary" icon={<AttachMoneyRounded />} />
                                <Box mt={"1rem"}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Subtotal</Typography>
                                        <Typography>{cart ? "$" + cart.subTotal.toFixed(2) : <Skeleton width={"48px"} />}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>GST (9%)</Typography>
                                        <Typography>{cart ? "$" + cart.taxTotal.toFixed(2) : <Skeleton width={"48px"} />}</Typography>
                                    </Box>
                                    <Divider sx={{ marginY: "1rem" }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Total</Typography>
                                        <Typography variant='h5' fontWeight={700}>{cart ? "$" + cart.totalPrice.toFixed(2) : <Skeleton />}</Typography>
                                    </Box>
                                </Box>

                                <Button disabled={cart?.cart.length == 0} startIcon={<ArrowForwardRounded />} variant="contained" fullWidth sx={{ marginTop: "1rem" }} LinkComponent={Link} to="/cart/checkout">Continue To Checkout</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={deleteItemDialog} onClose={handleDeleteItemDialogClose}>
                <DialogTitle>Delete Cart Item?</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to delete this item from your cart? <br/>({deleteCart?.availability.activity.name} - {deleteCart?.pax} pax on {moment(deleteCart?.availability.date).format("DD/MM/YYYY")})
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteItemDialogClose} startIcon={<CloseRounded />}>Cancel</Button>
                    <LoadingButton loadingPosition="start" loading={deleteLoading} variant="text" color="error" startIcon={<DeleteRounded />} onClick={handleDeleteItem}>Delete Item</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ViewCart