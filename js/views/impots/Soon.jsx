import React from "react";

import styled from "styled-components";
import { style } from "./style.js";

const StyledSoon = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: ${style.blueLUP};

  h1 {
    color: ${style.blueLUP};
  }

  h2 {
    color: ${style.blueLUP};
    text-align: center;
  }
`;

export const Soon = () => (
  <StyledSoon>
    <h1>Les simulateurs de la révolution fiscale</h1>
    Simulez votre imposition avec Jean-Luc Mélenchon en 10 secondes
    <h2>
      <strong>Disponible dans quelques jours !</strong>
    </h2>
  </StyledSoon>
);

export default Soon;
