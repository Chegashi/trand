const getCookies = (key:string) => {
    const cookie = document.cookie.split(';').filter((x) => x.trim().split('=')[0] === key)[0];
    // const cookie2 = document.cookie
    // console.log("INSIDE GET COOKIES HAHA " + cookie + " || " + cookie2);
    if (!cookie)
   { return '';}
   return cookie.split('=')[1];

}

const   IsAuthOk = (key:string) => {
    
    if(key == "401")
    {
        localStorage.setItem("authenticated","");
        localStorage.setItem("user","");
        localStorage.setItem("trylogin","false");
        return(1);
    }
return (0);

}


const IsInfoFound = (key:string) => {

    if(key == "404")
    {   
        return(1);
    }
    return (0);
}

export {
    getCookies,
    IsAuthOk
}

