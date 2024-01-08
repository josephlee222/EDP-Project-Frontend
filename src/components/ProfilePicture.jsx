import React from 'react'
import { Avatar } from '@mui/material'
import { stringAvatar } from "../functions/stringAvatar";
import md5 from "md5";

function ProfilePicture(props) {
    const { user } = props
    const email_md5 = md5(user.email)
    const s = {
        ...stringAvatar(user.name).sx,
        ...props.sx
    }
    return (
        <>
            {user.profilePictureType === "gravatar" && <Avatar {...props} src={"https://www.gravatar.com/avatar/" + email_md5} />}
            {user.profilePictureType === "local" && <Avatar {...props} src={user.profile_picture + "?t=" + new Date().getTime()} />}
            {!user.profilePictureType && <Avatar  {...stringAvatar(user.name) } sx={s} />}
        </>
    )
}

export default ProfilePicture