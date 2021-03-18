import React from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

import type { BaseResponsePaging} from '@/apis/fetch';
import Fetch, { buildURL } from '@/apis/fetch';

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
