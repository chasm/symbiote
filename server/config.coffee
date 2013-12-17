Accounts.loginServiceConfiguration.remove service: "github"
if process.env.ON_LOCALHOST
  Accounts.loginServiceConfiguration.insert
    service: "github",
    clientId: "5d61f9fb0223a1cf9158",
    secret: "cc1685fd03eed2c99039eb808bfd9edb221af547"
else
  Accounts.loginServiceConfiguration.insert
    service: "github",
    clientId: "79a57ae5dd5e7ad63845",
    secret: "0687642c45938694403fd190d24c01186548d0ea"