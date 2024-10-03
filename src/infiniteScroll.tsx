import React, { useState, useEffect, useRef } from 'react';
import { getMockData, MockData } from './mockData.ts';  
import styled from 'styled-components';

const ProductList = () => {
  const [products, setProducts] = useState<MockData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Mock API 호출
  const fetchProducts = async (page: number): Promise<void> => {
    setLoading(true);
    const { datas, isEnd }: { datas: MockData[], isEnd: boolean } = await getMockData(page);
    setProducts((prev) => [...prev, ...datas]);
    setIsEnd(isEnd);
    setLoading(false);
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = products.reduce((acc, product) => acc + product.price, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [products]);

  // Intersection Observer 설정
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (loading || isEnd) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (lastProductRef.current) observer.current.observe(lastProductRef.current);
  }, [loading, isEnd]);

  // 새 페이지 데이터 가져오기
  useEffect(() => {
    if (!isEnd) {
      fetchProducts(page);
    }
  }, [page]);

  return (
    <ProductListContainer>
      <Title>총 가격: {totalPrice.toLocaleString()} 원</Title>
      <ProductContainer>
        {products.map((product, index) => (
          <ProductCard key={product.productId} ref={index === products.length - 1 ? lastProductRef : null}>
            <ProductName>{product.productName}</ProductName>
            <ProductPrice>가격: {product.price.toLocaleString()} 원</ProductPrice>
          </ProductCard>
        ))}
      </ProductContainer>
      {loading && <LoadingMessage>불러오는 중...</LoadingMessage>}
      {isEnd && <EndMessage>더 이상 불러올 제품이 없습니다.</EndMessage>}
    </ProductListContainer>
  );
};

export default ProductList;

// Styled Components
const ProductListContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
`;

const ProductCard = styled.div`
  width: 220px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProductName = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #555;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
`;

const EndMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
  font-weight: bold;
  color: red;
`;
