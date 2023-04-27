(() => {
  const account = localStorage.getItem("account");
  if (account) {
    try {
      const { email, password } = JSON.parse(atob(account));
      $ry("#account_email").val(email);
      $ry("#account_password").val(password);
      ($ry("#account_checkbox").element as HTMLInputElement).checked = true;
    } catch (error) {}
  }
})();
$ry(".submit").click(() => {
  const email = $ry("#account_email").val();
  const password = $ry("#account_password").val();
  const checkbox = ($ry("#account_checkbox").element as HTMLInputElement)
    .checked;

  if (!email || !password) {
    $ryTools.notify({
      description: "账号或密码为空",
      type: "error",
    });
    return;
  }

  axios({
    method: "post",
    url: "/api/account/login",
    data: qs.stringify({
      email,
      password,
    }),
  }).then(({ data: res }) => {
    if (res.code === 0) {
      $ryTools.notify({
        description: res.msg,
      });
      if (checkbox) {
        localStorage.setItem(
          "account",
          btoa(JSON.stringify({ email, password }))
        );
      } else {
        localStorage.removeItem("account");
      }
      setTimeout(() => {
        window.location.replace(
          decodeURIComponent($ryTools.getUrlValue("path") || "/")
        );
      }, 1000);
    } else {
      $ryTools.notify({
        description: res.data,
        type: "error",
      });
    }
  });
});
