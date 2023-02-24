$ry(".logout").click(() => {
  axios({
    method: "post",
    url: "/api/account/logout",
  }).then(({ data: res }) => {
    if (res.code === 0 || res.code === -2) {
      $ryTools.notify({
        description: res.msg,
        type: res.code === 0 ? "success" : "error",
      });
      setTimeout(() => {
        window.location.replace("/");
      }, 1000);
    } else {
      $ryTools.notify({
        description: res.msg,
        type: "error",
      });
    }
  });
});
