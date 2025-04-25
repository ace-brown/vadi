import React from "react";
import Image from "next/image";

import news1 from "@/images/growth.jpg";
import news2 from "@/images/launch.jpg";
import news3 from "@/images/planning.jpg";
import classes from "./newsCard.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const NewsCard1 = () => {
  return (
    <article className={classes.card}>
      <div className={classes["card-img"]}>
        <Image src={news1} alt="news1" />
      </div>
      <div className={classes["card-content"]}>
        <h1>عنوان اولین پست وبلاگ</h1>
        <p>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. زندگی، از
          یک مجموعه متصل، به سوی سادگی و زیبایی حرکت می‌کند
        </p>
        <Link href="./about">
          <Button className="mt-4">بیشتر بخوانید</Button>
        </Link>
      </div>
    </article>
  );
};

export const NewsCard2 = () => {
  return (
    <article className={classes.card}>
      <div className={classes["card-img"]}>
        <Image src={news2} alt="news 2" />
      </div>
      <div className={classes["card-content"]}>
        <h1>عنوان دومین پست وبلاگ</h1>
        <p>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. زندگی، از
          یک مجموعه متصل، به سوی سادگی و زیبایی حرکت می‌کند
        </p>
        <Link href="./about">
          <Button className="mt-4">بیشتر بخوانید</Button>
        </Link>
      </div>
    </article>
  );
};

export const NewsCard3 = () => {
  return (
    <article className={classes.card}>
      <div className={classes["card-img"]}>
        <Image src={news3} alt="news 3" />
      </div>
      <div className={classes["card-content"]}>
        <h1>عنوان سومین پست وبلاگ</h1>
        <p>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. زندگی، از
          یک مجموعه متصل، به سوی سادگی و زیبایی حرکت می‌کند
        </p>
        <Link href="./about">
          <Button className="mt-4">بیشتر بخوانید</Button>
        </Link>
      </div>
    </article>
  );
};
export const NewsCard4 = () => {
  return (
    <article className={classes.card}>
      <div className={classes["card-img"]}>
        <Image src={news3} alt="news 3" />
      </div>
      <div className={classes["card-content"]}>
        <h1>عنوان چهارمین پست وبلاگ</h1>
        <p>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. زندگی، از
          یک مجموعه متصل، به سوی سادگی و زیبایی حرکت می‌کند
        </p>
        <Link href="./about">
          <Button className="mt-4">بیشتر بخوانید</Button>
        </Link>
      </div>
    </article>
  );
};
