import React, { Fragment, useState } from "react";

import styled from "styled-components";

import JLM_LUP from "../../assets/JLM-LUP.png";
import BG_LUP from "../../assets/bg.jpg";
import BG_HERITAGE from "../../assets/bg_heritage.jpg";
import PHOTO_FISCALE from "../../assets/photo_fiscale.jpg";
const LOGO_PROGRAMME =
  "https://programme.lafranceinsoumise.fr/wp-content/uploads/2024/02/Logo-Leprogramme-copie@2x-1.png";

import { style } from "./style.js";

import { prettyNumber } from "./numeral";

const StyledSpacer = styled.div`
  height: 30px;
  ${({ size }) => size && `height: ${size};`};
`;

const Title = styled.span`
  font-size: 55px;
  line-height: 60px;
  margin-bottom: 16px;
  font-family: ${style.fontSofia};
  font-weight: 800;
  text-transform: uppercase;

  @media (max-width: ${style.collapse}) {
    line-height: 35px;
    font-size: 32px;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  background-image: url(${BG_LUP});
  background-image: ${({ isHeritage }) =>
    isHeritage ? `url(${BG_HERITAGE})` : `url(${BG_LUP})`};

  ${({ isHeritage }) =>
    isHeritage &&
    `background-color: ${style.blueLUP} !important; color: white;`}

  background-repeat: no-repeat;
  background-size: cover;

  height: 380px;
  @media (max-width: ${style.collapse}) {
    height: 195px;
  }

  > div {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: ${style.blueLUP};
    position: relative;

    img {
      height: 100%;
      max-height: 320px;
      min-width: 198px;
      max-width: 100%;
    }
  }

  > div:first-child {
    > div {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: ${style.collapse}) {
      font-size: 12px;
    }
  }

  @media (min-width: ${style.collapse}) {
    > div:first-child {
      justify-content: right;
    }
    > div:last-child {
      justify-content: left;
    }
  }

  @media (max-width: ${style.collapse}) {
    > div:first-child {
      width: 55%;
      padding-left: 30px;
    }
    > div:last-child {
      width: 45%;
      justify-content: left;
      overflow: hidden;
    }
  }
`;

const Video = styled.div`
  text-align: center;

  iframe {
    max-width: 90%;
    width: 100%;
    height: 100%;
    height: 400px;

    @media (max-width: ${style.collapse}) {
      height: 220px;
    }
  }
`;

const DescriptionText = styled.div`
  max-width: 580px;

  ul {
    padding-left: 20px;
    margin-bottom: 0;
  }
`;

const HowDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;

  > span {
    color: ${style.blueLUP};
    font-size: 24px;
    font-weight: bold;
  }

  @media (max-width: ${style.collapse}) {
    margin-top: 20px;
  }
`;

const AProposDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;

  > span {
    color: ${style.blueLUP};
    font-size: 24px;
    font-weight: bold;
  }

  @media (max-width: ${style.collapse}) {
    margin-top: 20px;
  }
`;

const StyledAPropos = styled.div`
  display: flex;
  background-color: #f6f2fc;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 20px;
  padding-right: 20px;

  @media (max-width: ${style.collapse}) {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  > div {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    width: 50%;
  }

  @media (max-width: ${style.collapse}) {
    flex-direction: column;
    padding-left: 10px;
    padding-right: 10px;

    > div {
      width: 100%;
    }
  }

  @media (min-width: ${style.collapse}) {
    > div:first-child {
      width: 60%;
      justify-content: end;
      margin-right: 25px;
    }
    > div:last-child {
      width: 40%;
      align-items: baseline;
      margin-left: 25px;
    }
  }
`;

const StyledHow = styled.div`
  display: flex;
  // align-items: center;
  background-color: #f6f2fc;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 20px;
  padding-right: 20px;

  @media (max-width: ${style.collapse}) {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  > div {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    width: 50%;
  }

  @media (max-width: ${style.collapse}) {
    flex-direction: column;
    padding-left: 10px;
    padding-right: 10px;

    > div {
      width: 100%;
    }
  }

  @media (min-width: ${style.collapse}) {
    > div:first-child {
      justify-content: end;
      margin-right: 25px;
    }
    > div:last-child {
      align-items: baseline;
      margin-left: 25px;
    }
  }

  ${Video} {
    width: 560px;
    max-width: 100%;

    @media (max-width: ${style.collapse}) {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
`;

const ShareLink = styled.a`
  padding: 10px 16px;
  font-weight: bold;
  margin: 4px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  display: inline-block;
  background-color: #1778f2;
  ${({ bg }) => bg && `background-color: ${bg};`}

  &:hover {
    color: white;
  }

  @media (max-width: ${style.collapse}) {
    width: 100%;
    max-width: 304px;
    text-align: center;
  }
`;

const StyledShareBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${style.blueLUP};
  font-size: 24px;
  padding: 20px;
  color: white;
  font-weight: bold;

  > div:first-child {
    margin-bottom: 20px;
    font-size: 24px;
  }

  @media (max-width: ${style.collapse}) {
    flex-direction: column;

    > div:first-child {
      margin-bottom: 10px;
      font-size: 14px;
    }
  }
`;

const StyledFooter = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;

  > div {
    text-align: center;
  }
`;

const FooterLink = styled.a`
  border: 1px solid ${style.blueLUP};
  width: 294px;
  height: 66px;
  background-color: white;
  font-weight: bold;
  display: inline-flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: ${style.blueLUP};
  margin: 4px;

  :hover {
    color: ${style.blueLUP};
  }
`;

const ButtonMenu = styled.button`
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 2px;
  font-size: 20px;
  background-color: white;
  height: 30px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-transform: none;
`;

const StyledMenu = styled.div`
  visibility: hidden;
  transition: 0.4s ease;
  width: 100%;
  height: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #dfdfdf;
  overflow: hidden;

  > div {
    display: inline-flex;
    flex-direction: column;
  }

  ${({ isOpen }) => isOpen && `height: 120px; visibility: visible;`}

  a {
    font-weight: bold;
    color: ${style.blueLUP};
    margin-bottom: 6px;
  }
`;

const StyledNavBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #dfdfdf;

  > div:first-child {
    max-width: ${style.collapse};
    width: 100%;
    display: flex;
    height: 76px;
    align-items: center;
    justify-content: space-between;

    @media (max-width: ${style.collapse}) {
      justify-content: space-around;
    }

    a {
      font-weight: bold;
      color: ${style.blueLUP};

      @media (max-width: ${style.collapse}) {
        :first-child,
        :nth-child(3) {
          display: none;
        }
      }
    }

    ${ButtonMenu} {
      @media (min-width: ${style.collapse}) {
        display: none;
      }
    }
  }
`;

const StyledAnd = styled.span`
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 14px;
  margin-top: 4px;
  margin-left: 4px;
`;

export const NAN_REVENUES = "🐷 💸";

export const Spacer = ({ size }) => <StyledSpacer size={size} />;

export const SourceImpots = () => (
  <div style={{ color: "#4F4F4F", fontSize: "10px", marginTop: "34px" }}>
    Source : impots.lafranceinsoumise.fr
  </div>
);

export const ShareBlock = ({ isHeritage, impots }) => {
  const link = isHeritage ? "/heritage" : "/";
  const encodedLink = encodeURIComponent(link);
  const gain = isHeritage
    ? impots.nextHeritage - impots.currentHeritage
    : impots.gain;
  const winner = isHeritage ? "mon héritage gagnera" : "je gagnerai";
  const byYear = isHeritage ? "" : " en + par an";
  const gainString = `${prettyNumber(gain)} €${byYear}`;

  const URL = encodeURIComponent("https://impots.lafranceinsoumise.fr/");

  const urlTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    !gain || gain <= 0
      ? "Simulez votre imposition avec Mélenchon en 10 secondes. Testez vous aussi !"
      : `Avec la #RévolutionFiscale de Mélenchon, ${winner} ${gainString}. Testez vous aussi !`
  )}&url=https://impots.lafranceinsoumise.fr${encodedLink}`;

  return (
    <StyledShareBlock>
      <div>Partagez la révolution fiscale</div>
      <div style={{ textAlign: "center" }}>
        <ShareLink
          href={`https://www.facebook.com/sharer/sharer.php?u=${URL}${encodedLink}`}
          bg="#1778F2"
        >
          Je partage sur Facebook
        </ShareLink>
        <ShareLink href={urlTwitter} bg="#4099FF">
          Je partage sur Twitter
        </ShareLink>
        <ShareLink
          target="_blank"
          href="https://lafranceinsoumise.fr"
          bg="#F53B3B"
        >
          Je soutiens Jean-Luc Mélenchon
        </ShareLink>
      </div>
    </StyledShareBlock>
  );
};

const Menu = ({ isOpen, isHeritage }) => (
  <StyledMenu isOpen={isOpen}>
    <div>
      {isHeritage ? (
        <a href="/revenu">Simulateur d’impôts</a>
      ) : (
        <a href="/heritage">Simulateur d’héritage</a>
      )}
      <a href="https://programme.lafranceinsoumise.fr">Découvrir le programme</a>
      <a href="https://programme.lafranceinsoumise.fr/programme/livre/">Voir toutes les mesures</a>
    </div>
  </StyledMenu>
);

export const NavBar = ({ isHeritage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSwitchMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <StyledNavBar>
      <div>
        <a href="https://programme.lafranceinsoumise.fr">&larr; Voir tout le programme</a>
        <a href="https://programme.lafranceinsoumise.fr" style={{ marginTop: "5px" }}>
          <img src={LOGO_PROGRAMME} alt="Logo" width="200px" />
        </a>

        {isHeritage ? (
          <a href="/revenu" style={{ textAlign: "center" }}>
            <span style={{ fontWeight: "normal" }}>Essayez aussi :</span>
            <br />
            le simulateur d’impôts
          </a>
        ) : (
          <a href="/heritage" style={{ textAlign: "center" }}>
            <span style={{ fontWeight: "normal" }}>Essayez aussi :</span>
            <br />
            le simulateur d’héritage
          </a>
        )}
        <ButtonMenu onClick={onSwitchMenu}>{!isOpen ? "+" : "⨯"}</ButtonMenu>
      </div>
      <Menu isOpen={isOpen} isHeritage={isHeritage} />
    </StyledNavBar>
  );
};

export const Header = ({ isHeritage }) => (
  <StyledHeader isHeritage={isHeritage}>
    <div>
      <div>
        <span style={{ textTransform: "uppercase" }}>
          {isHeritage ? (
            <Fragment>Le simulateur d’impôt&nbsp;sur</Fragment>
          ) : (
            "LE SIMULATEUR DE LA"
          )}
        </span>
        <Title>
          {isHeritage ? (
            <Fragment>
              L’héritage
              <StyledAnd>et les</StyledAnd>
              donations
            </Fragment>
          ) : (
            <Fragment>
              REVOLUTION
              <br />
              <span style={{ color: style.roseLUP }}>FISCALE</span>
            </Fragment>
          )}
        </Title>
        <span>
          Simuler votre imposition avec
          <br /> Jean-Luc Mélenchon en 10&nbsp;secondes
        </span>
      </div>
    </div>
    <div>
      <img src={JLM_LUP} alt="Jean-Luc Mélenchon" />
    </div>
  </StyledHeader>
);

export const HowItWorks = ({ isHeritage }) => (
  <StyledHow>
    <div>
      <Video>
        <iframe
          style={{ maxWidth: "90%" }}
          src="https://www.youtube.com/embed/I6p5Ns7XNmM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Video>
    </div>
    <HowDescription>
      <span>Comment ça marche</span>
      <Spacer size="16px" />
      {!isHeritage ? (
        <DescriptionText>
          Ce simulateur est un <strong>outil pédagogique</strong> qui simplifie
          légèrement le système de calcul de l'impôt actuel.
          <Spacer size="8px" />
          <strong>
            C'est un outil pédagogique qui n'a pas vocation à être exact à
            l'euro&nbsp;près.
          </strong>
          <Spacer size="8px" />
          Par exemple, ce simulateur ne tient pas compte des divers crédits et
          réductions d'impôt du système actuel.
          <Spacer size="8px" />
          Un impôt négatif signifie un crédit d'impôt : le montant indiqué est
          alors versé par le Trésor public.
          <Spacer size="8px" />
          Avec la <strong>#RévolutionFiscale</strong>, le système injuste du
          quotient familial fiscal, qui ne bénéficie pas du tout aux pauvres et
          beaucoup aux très riches, est remplacé par un crédit d'impôt par
          enfant, indépendant du revenu des parents.
          <Spacer size="8px" />
          L'impôt est calculé sur le revenu de chaque individu, plutôt que par
          foyer. Cela corrige le système injuste actuel, qui favorise les plus
          riches et les inégalités de salaires.
          <Spacer size="8px" />
          <strong>La CSG est rendue progressive</strong>, avec également{" "}
          <strong>quatorze tranches</strong>.
        </DescriptionText>
      ) : (
        <DescriptionText>
          Ce simulateur est un outil pédagogique qui simplifie le système de
          calcul actuel des <strong>droits de succession</strong>.
          <Spacer size="8px" />
          <strong>
            C'est un outil pédagogique qui n'a pas vocation à être exact.
          </strong>
          <Spacer size="8px" />
          Par exemple, ce simulateur ne tient pas compte des patrimoines pour
          lesquels il existe des régimes spécifiques, comme les assurances-vie,
          les biens professionnels, ou des très nombreux abattements
          spécifiques.
          <Spacer size="8px" />
          Lorsque vous cliquez sur <strong>“d’autres personnes”</strong> nous
          considérons que vous avez{" "}
          <a
            href="https://melenchon.fr/2022/01/24/lheritage-de-la-societe-ou-la-societe-des-heritiers/"
            target="_blank"
            style={{ color: style.blueLUP }}
          >
            adopté socialement
          </a>{" "}
          ces personnes à qui vous souhaitez transmettre (sinon, la situation ne
          change pas)
          <Spacer size="8px" />
          Lorsque vous indiquez être <strong>marié/pacsé</strong> nous
          considérons que le patrimoine que vous souhaitez transmettre est le
          patrimoine commun que vous possédez.
          <Spacer size="8px" />
          Avec la #RévolutionFiscale, l’impôt sur le patrimoine{" "}
          <strong>
            baissera ou n’augmentera pas pour 90&nbsp;% des contribuables
          </strong>
          .
          <Spacer size="8px" />
          Au-delà, il sera progressif, avec un héritage maximal à 12 millions
          d’euros.
          <Spacer size="8px" />
          Au-delà de ce seuil, l’argent collecté financera la garantie
          d’autonomie qui permettra à chaque jeune détaché du foyer fiscal de
          ses parents d’avoir un revenu minimal garanti à 1063&nbsp;€ par mois.
        </DescriptionText>
      )}
    </HowDescription>
  </StyledHow>
);

const StyledTitle = styled.span`
  color: ${style.roseLUP};
  font-weight: bold;
  font-size: 20px;
`;
const StyledSubTitle = styled.span`
  color: ${style.blueLUP};
  font-weight: bold;
  font-size: 16px;
`;

export const HowItWorksRevenu = () => (
  <StyledHow style={{ backgroundColor: "white" }}>
    <div>
      <Video>
        <iframe
          style={{ maxWidth: "90%" }}
          src="https://www.youtube.com/embed/I6p5Ns7XNmM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Video>
    </div>
    <HowDescription>
      <span>Comprendre la révolution fiscale</span>
      <Spacer size="16px" />
      <DescriptionText>
        <StyledTitle>Impôt sur le revenu</StyledTitle>
        <Spacer size="16px" />
        <StyledSubTitle>Aujourd’hui</StyledSubTitle>
        <Spacer size="6px" />
        <ul>
          <li>
            <strong>L’impôt sur le revenu est devenu injuste</strong>. Il est
            passé de 14 à 5 tranches, ce qui concentre l'effort sur la classe
            moyenne.{" "}
          </li>
          <li>
            <strong>
              L’imposition conjointe des couples (quotient conjugal) bénéficie
              surtout aux plus riches
            </strong>{" "}
            et encourage les inégalités de salaires entre les femmes et les
            hommes.{" "}
          </li>
          <li>
            <strong>
              Le « quotient familial fiscal » (parts supplémentaires par enfant)
              ne bénéficie pas du tout aux non-imposables
            </strong>
            , mais beaucoup aux très riches.
          </li>
        </ul>
        <Spacer size="16px" />
        <StyledSubTitle>Avec la révolution fiscale</StyledSubTitle>
        <Spacer size="6px" />
        <ul>
          <li>
            L'impôt sur le revenu devient{" "}
            <strong>vraiment progressif, avec 14 tranches</strong>.
          </li>
          <li>
            L'impôt est calculé sur le salaire de chaque individu, en fonction
            de son taux propre.
          </li>
          <li>
            Chaque famille reçoit{" "}
            <strong>
              le même crédit d'impôt en fonction du nombre d'enfants à charge
            </strong>
            . Lorsque le crédit est supérieur à l'impôt payé, cet argent leur
            est versé par l’État.
          </li>
        </ul>
        <Spacer size="16px" />
        <StyledTitle>Contribution sociale généralisée (CSG)</StyledTitle>
        <Spacer size="16px" />
        <StyledSubTitle>Aujourd’hui</StyledSubTitle>
        <Spacer size="6px" />
        Chaque salarié·e paie la CSG au même taux (9,2 %), directement sur son
        salaire : un·e salarié·e au SMIC paie la même proportion qu’un
        millionnaire. C’est l’impôt le plus injuste, et très peu de gens le
        connaissent !
        <Spacer size="16px" />
        <StyledSubTitle>Avec la révolution fiscale</StyledSubTitle>
        <Spacer size="6px" />
        Nous rendrons son taux progressif, avec 14 tranches. Les petits paient
        petit, et les gros paient gros.
      </DescriptionText>
    </HowDescription>
  </StyledHow>
);

const StyledImageAPropos = styled.div`
  flex-direction: column;

  img {
    max-height: 410px;
    @media (max-width: ${style.collapse}) {
      max-height: 210px;
    }
  }
`;

export const AProposRevenu = () => (
  <StyledAPropos>
    <AProposDescription>
      <span>À propos</span>
      <Spacer size="16px" />
      <DescriptionText>
        Ce simulateur est un <strong>outil pédagogique</strong> qui simplifie
        légèrement le système de calcul de l'impôt actuel.
        <Spacer size="8px" />
        <strong>
          C'est un outil pédagogique qui n'a pas vocation à être exact à
          l'euro&nbsp;près.
        </strong>
        <Spacer size="8px" />
        Par exemple, ce simulateur ne prend en compte que les revenus des
        salariés (et non des retraités, chômeurs…), et ne permet pas d’appliquer
        les divers crédits et réductions d'impôt du système actuel.
        <Spacer size="8px" />
        Un impôt négatif signifie un crédit d'impôt&nbsp;: le montant indiqué
        est alors versé par le Trésor public.
        {/* Par exemple, ce simulateur ne tient pas compte des divers crédits et
        réductions d'impôt du système actuel.
        <Spacer size="8px" />
        Un impôt négatif signifie un crédit d'impôt : le montant indiqué est
        alors versé par le service des impôts.
        <Spacer size="8px" />
        Avec la #RévolutionFiscale, la nouvelle imposition remplace le système
        injuste du quotient familial fiscal par un{" "}
        <strong>crédit d'impôt égal</strong> pour chaque enfant. Ainsi le nouvel
        impôt intègre une diminution de 1 000 € par an pour chaque enfant et
        quel que soit le revenu des parents.
        <Spacer size="8px" />
        L'impôt est calculé sur le revenu de chaque individu, plutôt que par
        foyer. Cela corrige le système injuste actuel, qui favorise les plus
        riches et les inégalités de salaires.
        <Spacer size="8px" />
        <strong>La CSG est progressive</strong>, découpée en cinq tranches et
        totalement déductible de l'impôt sur les revenus. */}
      </DescriptionText>
    </AProposDescription>

    <StyledImageAPropos>
      <Spacer />
      <a href="https://programme.lafranceinsoumise.fr/plans/justice-fiscale/" target="_blank">
        <img src={PHOTO_FISCALE} style={{ maxHeight: "300px" }} />
      </a>
      <Spacer />
      <a
        href="https://programme.lafranceinsoumise.fr/plans/justice-fiscale/"
        target="_blank"
        style={{
          backgroundColor: "#F53B3B",
          padding: "10px",
          color: "white",
          fontwWeight: "bold",
          borderRadius: "4px",
        }}
      >
        Lire notre plan pour faire la justice fiscale
      </a>
    </StyledImageAPropos>
  </StyledAPropos>
);

export const Footer = ({ isHeritage }) => (
  <StyledFooter>
    <Spacer />
    <img src={LOGO_PROGRAMME} alt="Mélenchon 2022" width="200px" />
    <div style={{ marginTop: "20px" }}>
      <FooterLink href="https://lafranceinsoumise.fr">
        Le site de la France Insoumise
      </FooterLink>
      <FooterLink href="https://programme.lafranceinsoumise.fr/">
        Découvrir le programme
      </FooterLink>
      {isHeritage ? (
        <FooterLink href="/revenu">Simulateur d’impôts</FooterLink>
      ) : (
        <FooterLink href="/heritage">Simulateur d’héritage</FooterLink>
      )}
    </div>
    <Spacer />
  </StyledFooter>
);
