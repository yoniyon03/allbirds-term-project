import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 28px;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 22px;
  letter-spacing: -0.5px;
`;

const Form = styled.form`
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 18px;
  display: grid;
  gap: 12px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: center;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 13px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 90px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  resize: vertical;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 6px;
`;

const Btn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$primary ? "#111" : "#ddd")};
  background: ${(p) => (p.$primary ? "#111" : "#fff")};
  color: ${(p) => (p.$primary ? "#fff" : "#111")};
  cursor: pointer;
  font-weight: 700;
`;

async function api(path, options) {
  const res = await fetch(path, { credentials: "include", ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "요청 실패");
  return data;
}

export default function AdminProductNew() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [availableSizes, setAvailableSizes] = useState("250,255,260");
  const [discountRate, setDiscountRate] = useState("0");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    (async () => {
      const m = await api("/api/auth/me");
      if (!m.user || m.user.role !== "admin") {
        nav("/login");
        return;
      }
      setMe(m.user);
    })().catch(() => nav("/login"));
  }, [nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim()) return alert("상품명을 입력하세요.");
      if (!files?.length) return alert("이미지는 필수입니다(1장 이상).");

      const fd = new FormData();
      fd.append("name", name);
      fd.append("shortDescription", shortDescription);
      fd.append("discountRate", discountRate);
      fd.append("availableSizes", availableSizes);

      // 여러 장 업로드 허용 (Product schema: images 최소 2개 권장)
      Array.from(files).forEach((f) => fd.append("images", f));

      await api("/api/products", { method: "POST", body: fd });
      alert("등록 완료");
      nav("/admin/products");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Wrap>
      <Title>상품 등록</Title>
      <Form onSubmit={onSubmit}>
        <Row>
          <Label>상품명*</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Row>
        <Row>
          <Label>짧은 설명</Label>
          <Textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </Row>
        <Row>
          <Label>가용 사이즈*</Label>
          <Input
            value={availableSizes}
            onChange={(e) => setAvailableSizes(e.target.value)}
            placeholder="예: 250,255,260"
          />
        </Row>
        <Row>
          <Label>할인율(%)</Label>
          <Input
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
            placeholder="0~100"
          />
        </Row>
        <Row>
          <Label>이미지*</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </Row>

        <Actions>
          <Btn type="button" onClick={() => nav("/admin/products")}>
            취소
          </Btn>
          <Btn $primary type="submit">
            등록
          </Btn>
        </Actions>
      </Form>
    </Wrap>
  );
}
