const getNavigation = (isAuthenticated, user) => {

  const authLinks = [
    {
      title: "Books",
      link: "/books"
    },
    {
      title: "Events",
      link: "/events"
    },
    {
      title: "My Page",
      link: `/my-page/${isAuthenticated && user.userId}`
    },
    {
      title: "Logout",
      link: "/logout"
    }
  ]

  const guestLinks = [
    {
      title: "Books",
      link: "/books"
    },
    {
      title: "Events",
      link: "/events"
    },
    {
      title: "Register",
      link: "/register"
    },
    {
      title: "Login",
      link: "/login"
    }
  ]
  return isAuthenticated ? authLinks : guestLinks;
}

export default getNavigation;