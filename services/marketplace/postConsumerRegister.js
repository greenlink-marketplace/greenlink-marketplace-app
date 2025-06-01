import apiMarketplace from "./apiMarketplace"

export default async function posConsumerRegister({
  first_name,
  last_name,
  username,
  email,
  cpf,
  phone,
  address,
  password
}) {
  var requestData = {
    first_name,
    last_name,
    username,
    email,
    cpf,
    phone,
    address,
    password
  }
  const response = await apiMarketplace.post('register/consumer/', requestData)
  return response.data
}
