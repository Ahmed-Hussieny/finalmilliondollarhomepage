import axios from 'axios';

export const createCharge = async ({
    price,
    title,
    id,
    username,
    email,

}) => {
    try {
        const tapResponse = await axios.post(
            `${process.env.TAP_URL}/charges`,
            {
              amount: price,
              currency: "SAR",
              threeDSecure: false,
              save_card: false,
              description: `Payment for logo: ${title}`,
              statement_descriptor: "LOGO-PAY",
              metadata: { logoId: id },
              reference: {
                transaction: `logo_${id}`,
                order: `order_${id}`,
              },
              receipt: {
                email: true,
                sms: true,
              },
              customer: {
                first_name: username,
                email:  email,
              },
              source: {
                id: "src_card",
              },
              post: {url: `${process.env.HOST_URL}/pixel/webhook`},
              redirect: {
                url: `${process.env.FRONT_END_URL}/#/?logoId=${id}`,
              },
            },
            {
              headers: {
                Authorization: `${process.env.TAP_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            }
        );
        return tapResponse.data.transaction.url;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};