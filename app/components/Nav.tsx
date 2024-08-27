"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Link from "@mui/material/Link";
import * as NextLink from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface LinksInterface {
  display: string;
  url: string;
}

const links: Array<LinksInterface> = [
  { display: "Allocations", url: "/" },
  { display: "Assets", url: "/assets" },
  { display: "Locations", url: "/locations" },
  { display: "Compute", url: "/compute" },
];

export default function BasicTabs() {
  const pathname = usePathname();
  const [value, setValue] = React.useState(
    links.map((v) => v.url).indexOf(pathname) || 0
  );

  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(links[newValue].url);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {links.map((v: LinksInterface, i: number) => (
            <Tab key={i} label={v.display} {...a11yProps(i)} />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
