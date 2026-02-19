(function () {
  const AUTH_KEY = "faro_auth";
  const isLoginPage = /login\.html$/i.test(window.location.pathname);

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  }

  if (isLoginPage) {
    if (isAuthenticated()) {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "index_compact.html";
      window.location.replace(next);
    }
    return;
  }

  if (!isAuthenticated()) {
    const next = window.location.pathname.split("/").pop() + window.location.search;
    window.location.replace(`login.html?next=${encodeURIComponent(next)}`);
  }
})();
