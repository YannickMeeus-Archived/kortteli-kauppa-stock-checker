import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Text, Link, Divider } from "@chakra-ui/react";
import { InformationCard } from "../../components/information-card";
import { Page } from "../../components/page";
import { PageHeader } from "../../components/page-header";
import { useGetVersionQuery } from "../../features/infrastructure/version";

interface StatsCardProps {
  title: string;
  stat: string;
}

function ExplanationPage() {
  const { data } = useGetVersionQuery();
  return (
    <Page>
      <PageHeader>What is this all about?</PageHeader>
      <InformationCard>
        <Text>
          I have been using the amazing Kortteli Kauppa shop near me for quite
          some time now, and the only gripe I have with them is the rather...
          <Link
            isExternal
            href="http://188.166.11.123/Kortteliapp/placeinventory.html?link=Kuninkaantammi"
          >
            sparse <ExternalLinkIcon mx="2px" />
          </Link>
          user interface, and the fact it loads quite slowly.
        </Text>
        <Divider mt={4} mb={4} />
        <Text>
          So with that I decided to try and do something about it. With my very
          limited experience in frontend development I decided to try and build
          something <i>nicer</i>. I am also building a custom back-end for this,
          and am swinging between learning Rust and Ruby on Rails. Currently
          this is running against a Rails back-end, but with God as my witness I
          will wrangle the Rust compiler, and ultimately swap over.
        </Text>
      </InformationCard>
    </Page>
  );
}

export { ExplanationPage };
