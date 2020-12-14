import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

import Fetch, { BaseResponsePaging, buildURL } from '@/apis/fetch';

interface HomeProps {
  data: any[];
}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div>
      <h1>Page home</h1>

      <p>
        <Button type="primary">按钮24</Button>
      </p>

      <p>
        <Link href="/?page=2">GO NEXT</Link>
      </p>

      {props.data.map((item) => {
        return (
          <p key={item.id}>
            {item.name}-{item.size}-{item.time}
          </p>
        );
      })}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (params) => {
  const data = await Fetch<BaseResponsePaging<any>>(buildURL('v1/attachment'), params.query, 'GET');

  return {
    props: {
      data: data.data.list || [],
    },
  };
};

export default Home;
