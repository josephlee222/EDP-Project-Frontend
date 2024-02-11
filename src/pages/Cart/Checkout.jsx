import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, Accordion, AccordionDetails, AccordionSummary, Stack, Alert } from '@mui/material'
import { AppContext } from '../../App';
import { AddRounded, ArrowForwardRounded, AttachMoneyRounded, BackpackRounded, CallRounded, CheckRounded, ConfirmationNumberRounded, DeleteRounded, ShoppingCartRounded } from '@mui/icons-material';
import titleHelper from '../../functions/helpers';
import http from '../../http';
import PageHeader from '../../components/PageHeader';
import CardTitle from '../../components/CardTitle';
import InfoBox from '../../components/InfoBox';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import TopUpDialog from '../../components/TopUpDialog';



function Checkout() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { user } = useContext(AppContext);
    const [couponLoading, setCouponLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [coupon, setCoupon] = useState(null)
    const [cart, setCart] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [deleteCartId, setDeleteCartId] = useState(null) // Used to store the id of the cart item to be deleted
    const { enqueueSnackbar } = useSnackbar();
    const [topupOpen, setTopupOpen] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    titleHelper("Checkout")

    const handleTopUpOpen = () => {
        setTopupOpen(true);
    }

    const handleTopUpClose = () => {
        setTopupOpen(false);
    }

    const couponFormik = useFormik({
        initialValues: {
            code: "",
        },
        validationSchema: Yup.object({
            code: Yup.string(),
        }),
        onSubmit: (data) => {
            setCouponLoading(true);

            if (data.code === "") {
                setCouponLoading(false);
                return
            }

            http.get("/Shop/Cart/Coupon?code=" + data.code).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
                    setCoupon(res.data)
                    setCouponLoading(false)
                } else {
                    enqueueSnackbar("Coupon application failed!.", { variant: "error" });
                    setCouponLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Coupon application failed! " + err.response.data.error, { variant: "error" });
                setCouponLoading(false);
            })
        }
    })

    const checkoutFormik = useFormik({
        initialValues: {
            email: "",
            phone: "",
            name: "",
            birthday: "",
            nric: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
            name: Yup.string().required("Name is required"),
            birthday: Yup.string().required("Birthday is required"),
            nric: Yup.string().required("NRIC is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);

            data.email = data.email.trim();
            data.phone = data.phone.trim();
            data.name = data.name.trim();
            data.birthday = moment(data.birthday).format("YYYY-MM-DD");
            data.nric = data.nric.trim();
            data.coupon = coupon ? coupon.code : null;

            http.post("/Shop/Cart/Checkout", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Checkout successful!", { variant: "success" });
                    setLoading(false)
                    navigate("/cart/checkout/success")
                    
                } else {
                    enqueueSnackbar("Checkout failed!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Checkout failed! " + err.response.data.error, { variant: "error" });
                setLoading(false);
            })
        }
    })

    const getCart = () => {
        http.get("/Shop/Cart").then((res) => {
            if (res.status === 200) {
                setCart(res.data)
                setTotalPrice(res.data.totalPrice)
                setLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to get cart", { variant: "error" })
        })
    }

    useEffect(() => {
        getCart()
    }, [])


    useEffect(() => {
        if (coupon) {
            const discount = cart.totalPrice - coupon.discountAmount
            if (discount < 0) {
                setTotalPrice(0)
            }
            setTotalPrice(discount)
            setCouponDiscount(coupon.discountAmount)
        }
    }, [coupon])

    return (
        <>
            <PageHeader icon={ShoppingCartRounded} title="Checkout" navTitle="Checkout" />
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <Grid container spacing={2} flexDirection={{ xs: "row-reverse", md: "row" }}>
                    <Grid item xs={12} md={9}>
                        <Stack spacing={"1rem"}>
                            <Card>
                                <CardContent>
                                    <CardTitle title="Coupon Code" icon={<ConfirmationNumberRounded />} />
                                    <Stack mt={"1rem"} spacing={"1rem"} direction={"row"}>
                                        <TextField
                                            fullWidth
                                            id="code"
                                            label="Coupon Code"
                                            variant="outlined"
                                            {...couponFormik.getFieldProps("code")}
                                            error={couponFormik.touched.code && Boolean(couponFormik.errors.code)}
                                            helperText={couponFormik.touched.code && couponFormik.errors.code}
                                        />
                                        <LoadingButton loading={couponLoading} variant="contained" onClick={couponFormik.submitForm} startIcon={<CheckRounded />}>Apply</LoadingButton>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <CardTitle title="Contact Information" icon={<CallRounded />} />
                                    <Box mt={"1rem"}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            variant="outlined"
                                            {...checkoutFormik.getFieldProps("name")}
                                            error={checkoutFormik.touched.name && Boolean(checkoutFormik.errors.name)}
                                            helperText={checkoutFormik.touched.name && checkoutFormik.errors.name}
                                            sx={{ mb: "1rem" }}
                                        />
                                        <Grid container spacing={"1rem"} sx={{ mb: "1rem" }}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="email"
                                                    label="Email"
                                                    variant="outlined"
                                                    {...checkoutFormik.getFieldProps("email")}
                                                    error={checkoutFormik.touched.email && Boolean(checkoutFormik.errors.email)}
                                                    helperText={checkoutFormik.touched.email && checkoutFormik.errors.email}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="phone"
                                                    label="Phone"
                                                    variant="outlined"
                                                    {...checkoutFormik.getFieldProps("phone")}
                                                    error={checkoutFormik.touched.phone && Boolean(checkoutFormik.errors.phone)}
                                                    helperText={checkoutFormik.touched.phone && checkoutFormik.errors.phone}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={"1rem"}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="birthday"
                                                    placeholder="Birthday"
                                                    label="Birthday"
                                                    type="date"
                                                    variant="outlined"
                                                    value={checkoutFormik.values.birthday}
                                                    {...checkoutFormik.getFieldProps("birthday")}
                                                    error={checkoutFormik.touched.birthday && Boolean(checkoutFormik.errors.birthday)}
                                                    helperText={checkoutFormik.touched.birthday && checkoutFormik.errors.birthday}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    id="nric"
                                                    label="NRIC"
                                                    variant="outlined"
                                                    {...checkoutFormik.getFieldProps("nric")}
                                                    error={checkoutFormik.touched.nric && Boolean(checkoutFormik.errors.nric)}
                                                    helperText={checkoutFormik.touched.nric && checkoutFormik.errors.nric}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>

                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <CardTitle title="Payment Summary" icon={<AttachMoneyRounded />} />
                                <Box mt={"1rem"}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Wallet Balance</Typography>
                                        <Typography>{user ? "$" + user.balance.toFixed(2) : <Skeleton />}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Subtotal</Typography>
                                        <Typography>{cart ? "$" + cart.subTotal.toFixed(2) : <Skeleton />}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>GST (9%)</Typography>
                                        <Typography>{cart ? "$" + cart.taxTotal.toFixed(2) : <Skeleton />}</Typography>
                                    </Box>
                                    {coupon &&
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography>Coupon Discount</Typography>
                                            <Typography>{cart ? "$" + couponDiscount.toFixed(2) : <Skeleton />}</Typography>
                                        </Box>
                                    }
                                    <Divider sx={{ marginY: "1rem" }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography>Total</Typography>
                                        <Typography variant='h5' fontWeight={700}>{cart ? "$" + totalPrice.toFixed(2) : <Skeleton />}</Typography>
                                    </Box>
                                </Box>
                                {user?.balance < totalPrice &&
                                    <>
                                        <Alert severity="warning" sx={{ marginTop: "1rem" }}>You do not have enough balance to complete this transaction</Alert>
                                        <Button startIcon={<AddRounded />} variant="contained" fullWidth sx={{ marginTop: "1rem" }} onClick={handleTopUpOpen}>Top-Up Wallet</Button>
                                    </>
                                }
                                {user?.balance >= totalPrice &&
                                    <Button startIcon={<ArrowForwardRounded />} variant="contained" fullWidth sx={{ marginTop: "1rem" }} onClick={checkoutFormik.submitForm}>Checkout</Button>
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <TopUpDialog open={topupOpen} onClose={handleTopUpClose} amount={Math.ceil((user?.balance - totalPrice) * -1)} />
        </>
    )
}

export default Checkout