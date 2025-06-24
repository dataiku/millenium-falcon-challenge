import { NextRequest, NextResponse } from 'next/server';
import { isEmpireIntel } from '@/lib/EmpireIntel';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const intel = formData.get('intel');

  if (!intel) {
    return NextResponse.json({
      success: false,
    });
  }

  const json = JSON.parse(await intel.toString());
  if (!isEmpireIntel(json)) {
    return NextResponse.json({
      success: false,
    });
  }

  return NextResponse.json({
    success: true,
    intel: json,
  });
}
