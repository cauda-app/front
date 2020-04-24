import React, { useState, useEffect } from 'react';

import graphqlClient from 'src/graphql-config';

const VerifyNumber = () => {
  // const { t } = useTranslation();

  const [shops, setShops] = useState();

  useEffect(() => {
    graphqlClient
      .request(
        `mutation {
            verifyClient(id: 21, verificationCode: "123") {
                id
                phoneValidated
            }
        }`
      )
      .then((data) => {
        setShops(data.shops);
      });
  }, []);

  return <div>asdasd</div>;
};

export default VerifyNumber;
