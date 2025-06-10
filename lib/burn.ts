import { ObjectId } from 'mongodb';

import { dbPromise } from '@/lib/mongodb';
import { Burn, BurnData, CollectionBurns } from '@/types';
import { WRAPPED_POCKET_ADDRESS } from '@/utils/constants';

import { PER_PAGE } from './constants';

export const getBurnFromId = async (id: string): Promise<Burn | null> => {
  try {
    const client = await dbPromise;

    const burn = await client.collection(CollectionBurns).findOne({
      _id: new ObjectId(id),
      wpokt_address: WRAPPED_POCKET_ADDRESS,
    });

    return burn as Burn | null;
  } catch (error) {
    console.error('Error finding burn:', error);
    return null;
  }
};

export const getAllBurns = async (_page: number): Promise<BurnData> => {
  const page = Number.isNaN(_page) || !_page || _page < 1 ? 1 : _page;

  try {
    const client = await dbPromise;

    const burns = await client
      .collection(CollectionBurns)
      .find(
        {
          wpokt_address: WRAPPED_POCKET_ADDRESS,
        },
        { sort: { block_number: -1, updated_at: -1, log_index: -1 } },
      )
      .skip((page - 1) * PER_PAGE)
      .limit(PER_PAGE)
      .toArray();

    const totalBurns = await client.collection(CollectionBurns).countDocuments({
      wpokt_address: WRAPPED_POCKET_ADDRESS,
    });

    const totalPages = Math.ceil(totalBurns / PER_PAGE);

    const data = {
      burns,
      page,
      totalBurns,
      totalPages,
    };

    return data as BurnData;
  } catch (error) {
    console.error('Error finding burns:', error);
    return {
      burns: [],
      page,
      totalBurns: 0,
      totalPages: 0,
    };
  }
};

export const getTotalBurnAmount = async (): Promise<string> => {
  try {
    const client = await dbPromise;

    const totalBurnAmount = await client
      .collection(CollectionBurns)
      .aggregate([
        {
          $match: {
            status: 'success',
            wpokt_address: WRAPPED_POCKET_ADDRESS,
          },
        },
        {
          $group: {
            _id: null,
            totalBurnAmount: {
              $sum: {
                $convert: {
                  input: {
                    $toLong: '$amount',
                  },
                  to: 'decimal',
                },
              },
            },
          },
        },
      ])
      .toArray();

    return totalBurnAmount[0]?.totalBurnAmount?.toString() || '0';
  } catch (error) {
    console.error('Error finding total burn amount:', error);
    return '0';
  }
};
