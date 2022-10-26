import React from 'react'
import {useFetchList} from '../hooks/useFetchList'
import { fetchAll } from '../http/friendsAPI'
import ListWrapper from '../components/ListWrapper'
import AdminWrapper from '../components/AdminWrapper'
import '../styles/admin.css'

const Admin = () => {

  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchAll, 15)

  return (
    <div className='admin'>
        <ListWrapper
          isEmpty={isEmpty}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          limitFunc={increasePage}
          classes={`admin__list ${isEmpty ? '' : 'list component'}`}
        >
          {listsItems.map((item) => {
            return <AdminWrapper key={item.id} item={item} />
          })}
        </ListWrapper>
    </div>
  )
}

export default Admin