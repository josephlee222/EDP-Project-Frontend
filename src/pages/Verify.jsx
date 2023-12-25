import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom'
import http from '../http'
import { useSnackbar } from 'notistack'


function Verify() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("t")
    const { enqueueSnackbar } = useSnackbar()
    const navigate = useNavigate()

    useEffect(() => {
        var data = {
            token: token
        }

        if (token) {
            http.post("/User/Verify", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Successfully verified your email address!", { variant: "success" })
                } else {
                    enqueueSnackbar("Failed to verify your email address! " + res.data.error, { variant: "error" })
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to verify your email address! " + err.response.data.error, { variant: "error" })
            })

            navigate("/login")
        }
    }, [])
}

export default Verify