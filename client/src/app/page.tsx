"use client";

import { useState } from "react";
import { useGetTasksQuery } from "../state/api";
import HomePage from "./home/page";

export default function Home() {
  return (
    <HomePage  />
  );
}
