import React, { Fragment, useState, useEffect } from "react";

import styled, { ThemeProvider } from "styled-components";

import SimuStore from "../../stores/SimuStore";
import SimulationHeritage from "../../data/simulation/heritage/Simulation";
import { prettyNumber } from "./numeral";

import { LessImpotsResults, MoreImpotsResults, Details } from "./Results";
import HeritageResults from "./HeritageResults";

import {
  NavBar,
  Header,
  HowItWorks,
  AProposRevenu,
  HowItWorksRevenu,
  Footer,
  ShareBlock,
  Spacer,
} from "./DisplayComponents";

import { style, THEMES } from "./style.js";

const SMIC = 1269;
const DEFAUT_PATRIMOINE = 120000;

const INIT_DATA_REVENU = {
  isSingle: true,
  salary: SMIC,
  mateSalary: "",
  children: 0,
};

const SITUATION_OPTIONS = [
  {
    value: "married",
    name: "Marié / Pacsé",
  },
  {
    value: "single",
    name: "Célibataire",
  },
];
const RECEIVER_OPTIONS = [
  {
    value: "children",
    name: "Mes enfants",
  },
  {
    value: "person",
    name: "D'autres personnes",
  },
];
const INIT_DATA_HERITAGE = {
  situation: SITUATION_OPTIONS[0].value,
  receiverType: RECEIVER_OPTIONS[0].value,
  receiverQuantity: 1,
  totalPatrimoine: DEFAUT_PATRIMOINE,
};

const INIT_IMPOTS = SimuStore.getInitialState().results;
// Example :
// current:    {IR: 842, CSG: 1886, total: 2728}
// revolution: {IR: 1416, CSG: 376, total: 1792}
// gain: 936

const CustomButton = styled.button`
  width: 164px;
  color: #777777;
  text-transform: none;
  ${({ active }) =>
    active && `background-color: ${style.blueLUP} !important; color: white;`}

  @media (max-width: ${style.collapse}) {
    width: 50%;
  }
`;

const CustomSelect = styled.select`
  width: 100%;
  border: 1px solid #ddd;
  background-color: white;
  padding: 10px;
  margin: 0;

  option {
    padding: 10px;
    height: 30px;
  }
`;

const BlockSelect = styled.div`
  width: 100%;
  @media (min-width: ${style.collapse}) {
    width: 310px;
  }
`;

const BlockQuantity = styled.div`
  width: 100%;
  @media (min-width: ${style.collapse}) {
    width: 245px;
  }
`;

const CustomInput = styled.input`
  width: 100%;
  position: relative;
`;

const StyledChildren = styled.div`
  @media (min-width: ${style.collapse}) {
    width: 200px;
  }

  @media (max-width: ${style.collapse}) {
    div {
      display: inline-block;
      width: 200px;
    }
  }

  @media (max-width: 500px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      display: inline-block;
      width: 150px;
    }
  }
`;

const CustomForm = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;

  @media (min-width: 1280px) {
    margin-left: -60px;
    margin-right: -60px;
  }

  @media (min-width: ${style.collapse}) {
    box-shadow: ${style.boxShadow};

    > div {
      border-right: 1px solid #dfdfdf;
      padding: 20px;
    }
  }

  @media (max-width: ${style.collapse}) {
    flex-direction: column;
    margin-left: 10px;
    margin-right: 10px;

    > div {
      width: 100%;
      padding-top: 17px;
      padding-bottom: 17px;
      border-bottom: 1px solid #dfdfdf;
    }
  }

  ${CustomInput}, ${CustomButton}, ${CustomSelect} {
    height: 44px;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
    padding: 7px;
    background-color: white;
    font-family: ${style.fontInter};
    font-weight: 500;
  }

  > div > span {
    display: inline-block;
    margin-bottom: 6px;
    // font-weight: bold;
    font-weight: 500;
  }
`;

const StyledContainer = styled.div`
  font-family: ${style.fontInter};
  position: relative;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  max-width: 1140px;

  @media (min-width: ${style.collapse}) {
    margin-top: -30px;
  }

  @media (max-width: ${style.collapse}) {
     {
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

const BlockInput = styled.div`
  position: relative;
  span {
    position: absolute;
    right: 24px;
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: #777777;
  }
`;

const StyledPage = styled.div`
  font-family: ${style.fontInter};
`;

const StyledEmptySalary = styled.div`
  padding: 20px;
  text-align: center;
  box-shadow: ${style.boxShadow};
`;

const formatNumber = (x) => {
  if (x === "") {
    return x;
  }
  const number = typeof x === "string" ? x.replaceAll(/\s/g, "") : x;
  return number >= 0 ? parseFloat(number) : 0;
};

const ImpotsSimulation = ({ isHeritage }) => {
  const [formDataRevenu, setFormDataRevenu] = useState(INIT_DATA_REVENU);
  const [formDataHeritage, setFormDataHeritage] = useState(INIT_DATA_HERITAGE);
  // const [impots, setImpots] = useState(INIT_IMPOTS);
  const [impots, setImpots] = useState(false);
  const [impotsHeritage, setImpotsHeritage] = useState(false);

  const theme = !isHeritage ? THEMES.themeDefault : THEMES.themeHeritage;

  const isEmptyMateSalary =
    !isHeritage &&
    !formDataRevenu.isSingle &&
    (formDataRevenu.salary === "" || formDataRevenu.mateSalary === "");

  // functions impots heritage
  const handleSelect = (e) => {
    setFormDataHeritage({
      ...formDataHeritage,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeInput = (e) => {
    const { value, name } = e.target;

    if (isHeritage) {
      setFormDataHeritage({ ...formDataHeritage, [name]: formatNumber(value) });
    } else {
      setFormDataRevenu({ ...formDataRevenu, [name]: formatNumber(value) });
    }
  };

  // functions impots revenu
  const onClickIsSingle = (e) => {
    const isSingle = e.target.value === "single";
    setFormDataRevenu({ ...formDataRevenu, isSingle });
  };

  const selectOnFocus = (e) => {
    e.target.select();
  };

  useEffect(() => {
    if (!isHeritage) {
      // Disable results when required fields are not set
      if (
        (formDataRevenu.salary === "" && formDataRevenu.isSingle) ||
        (!formDataRevenu.isSingle &&
          formDataRevenu.salary === "" &&
          formDataRevenu.mateSalary === "")
      ) {
        setImpots(false);
        return;
      }

      const couple = formDataRevenu.isSingle ? 0 : 1;
      const children = formDataRevenu.children || 0;

      const salary = formDataRevenu.salary || 0;
      const mateSalary = formDataRevenu.mateSalary || 0;
      // const mateSalary = formDataRevenu.isSingle ? 0 : (formDataRevenu.mateSalary || 0);

      const netSum = formDataRevenu.isSingle ? salary : salary + mateSalary;
      const netRevenues = { person1: salary, person2: couple ? mateSalary : 0 };

      if (netSum === 0) {
        setImpots(false);
        return;
      }

      const results = SimuStore.generateSeries(
        netRevenues,
        0,
        0,
        couple,
        children
      );

      let percentile = SimuStore.percentageRicher(netSum, couple);
      if (percentile < 1) {
        percentile = Math.round(percentile * 10000) / 10000;
      }

      setImpots({ ...results, percentile });
      return;
    }

    // HERITAGE SIMULATION

    // Disable results when required fields are not set
    if (formDataHeritage.totalPatrimoine === "") {
      setImpotsHeritage(false);
      return;
    }

    const patrimony = formDataHeritage.totalPatrimoine || 0;
    const heirs = formDataHeritage.receiverQuantity || 0;
    const isSingle = formDataHeritage.situation === "single";
    const toChildren = formDataHeritage.receiverType === "children";

    const results = SimulationHeritage(patrimony, heirs, isSingle, toChildren);

    setImpotsHeritage(results);
  }, [formDataRevenu, formDataHeritage]);

  const sumRevenues =
    formDataRevenu?.salary +
    (!formDataRevenu?.isSingle ? formDataRevenu?.mateSalary : 0);
  const isEnormousRevenues = sumRevenues > 9000000000000000;

  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <NavBar isHeritage={isHeritage} />
        <Header isHeritage={isHeritage} />
        <StyledContainer>
          <CustomForm>
            {!isHeritage ? (
              <Fragment>
                <div>
                  <span>Situation familiale</span>
                  <br />
                  <CustomButton
                    active={formDataRevenu.isSingle}
                    type="button"
                    value="single"
                    onClick={onClickIsSingle}
                    style={{ borderRight: 0 }}
                  >
                    {formDataRevenu.isSingle && "✓ "}
                    Célibataire
                  </CustomButton>
                  <CustomButton
                    active={!formDataRevenu.isSingle}
                    type="button"
                    value="plural"
                    onClick={onClickIsSingle}
                  >
                    {!formDataRevenu.isSingle && "✓ "}
                    Marié / Pacsé
                  </CustomButton>
                </div>
                <div style={{ flex: 1 }}>
                  <span>
                    Votre salaire <i>net mensuel</i>
                  </span>
                  <br />
                  <BlockInput>
                    <CustomInput
                      name="salary"
                      value={prettyNumber(formDataRevenu.salary)}
                      onChange={onChangeInput}
                      onFocus={selectOnFocus}
                    />
                    <span>€ net / mois</span>
                  </BlockInput>
                </div>
                {!formDataRevenu.isSingle && (
                  <div style={{ flex: 1 }}>
                    <span>Salaire de votre partenaire</span>
                    <br />
                    <BlockInput>
                      <CustomInput
                        name="mateSalary"
                        value={prettyNumber(formDataRevenu.mateSalary)}
                        onChange={onChangeInput}
                        onFocus={selectOnFocus}
                      />
                      <span>€ net / mois</span>
                    </BlockInput>
                  </div>
                )}
                <StyledChildren>
                  <span>Enfants à charge</span>
                  <br />
                  <div>
                    <CustomInput
                      type="number"
                      name="children"
                      value={prettyNumber(formDataRevenu.children)}
                      onChange={onChangeInput}
                      onFocus={selectOnFocus}
                      style={{ textAlign: "right" }}
                    />
                  </div>
                </StyledChildren>
              </Fragment>
            ) : (
              <Fragment>
                <BlockSelect>
                  <span>Situation familiale</span>
                  <br />
                  <CustomSelect
                    value={formDataHeritage.situation}
                    name="situation"
                    onChange={handleSelect}
                  >
                    {SITUATION_OPTIONS.map((r) => (
                      <option value={r.value} key={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </CustomSelect>
                </BlockSelect>
                <BlockSelect>
                  <span>À qui souhaitez-vous transmettre&nbsp;?</span>
                  <br />
                  <CustomSelect
                    value={formDataHeritage.receiverType}
                    name="receiverType"
                    onChange={handleSelect}
                  >
                    {RECEIVER_OPTIONS.map((r) => (
                      <option value={r.value} key={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </CustomSelect>
                </BlockSelect>
                <BlockQuantity>
                  <span>À combien de personnes&nbsp;?</span>
                  <br />
                  <div>
                    <CustomInput
                      type="number"
                      name="receiverQuantity"
                      style={{ width: "86px" }}
                      value={prettyNumber(formDataHeritage.receiverQuantity)}
                      onChange={onChangeInput}
                      onFocus={selectOnFocus}
                      min={1}
                    />
                  </div>
                </BlockQuantity>
                <div style={{ minWidth: "286px", flex: 1 }}>
                  <span>Valeur total de votre patrimoine</span>
                  <br />
                  <BlockInput>
                    <CustomInput
                      name="totalPatrimoine"
                      value={prettyNumber(formDataHeritage.totalPatrimoine)}
                      onChange={onChangeInput}
                      onFocus={selectOnFocus}
                      step={1000}
                    />
                    <span>€</span>
                  </BlockInput>
                  <i
                    style={{
                      display: "inline-block",
                      fontWeight: "normal",
                      marginTop: "6px",
                    }}
                  >
                    Hors biens professionnels et régimes spécifiques (ex&nbsp;:
                    assurance&nbsp;vie)
                  </i>
                </div>
              </Fragment>
            )}
          </CustomForm>

          <Spacer />

          {isEmptyMateSalary && (
            <Fragment>
              <StyledEmptySalary>
                Vous devez rentrer le salaire net de votre partenaire pour
                simuler le nouvel impôt
              </StyledEmptySalary>
              <Spacer />
            </Fragment>
          )}

          {!!impots && !isEmptyMateSalary && (
            <Fragment>
              {impots.gain >= 0 && !isEnormousRevenues ? (
                <LessImpotsResults impots={impots} />
              ) : (
                <MoreImpotsResults impots={impots} formData={formDataRevenu} />
              )}
            </Fragment>
          )}

          {!!impotsHeritage && <HeritageResults {...impotsHeritage} />}

          {!isHeritage
            ? !!impots && !isEmptyMateSalary && <Details impots={impots} />
            : !!impotsHeritage && (
                <Fragment>
                  <Details impots={impotsHeritage} isHeritage />
                  <Spacer />
                </Fragment>
              )}
        </StyledContainer>
        {isHeritage && (
          <ShareBlock
            isHeritage={isHeritage}
            impots={impotsHeritage || impots}
          />
        )}

        {!isHeritage ? (
          <Fragment>
            <HowItWorksRevenu />
            <ShareBlock
              isHeritage={isHeritage}
              impots={impotsHeritage || impots}
            />
            <AProposRevenu />
          </Fragment>
        ) : (
          <HowItWorks isHeritage={isHeritage} />
        )}

        <Footer isHeritage={isHeritage} />
      </StyledPage>
    </ThemeProvider>
  );
};

export default ImpotsSimulation;
